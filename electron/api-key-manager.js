const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const logger = require('./logger');
const { app } = require('electron');

// Simple encryption for our custom store
function encrypt(data, key) {
    try {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
        let encrypted = cipher.update(data, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return iv.toString('hex') + ':' + encrypted;
    } catch (error) {
        logger.log('error', 'Encryption error', { error: error.message });
        return data; // Fallback to unencrypted if encryption fails
    }
}

function decrypt(data, key) {
    try {
        const parts = data.split(':');
        if (parts.length !== 2) return data; // Not encrypted or invalid format
        
        const iv = Buffer.from(parts[0], 'hex');
        const encrypted = parts[1];
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        logger.log('error', 'Decryption error', { error: error.message });
        return data; // Return as-is if decryption fails
    }
}

// Simple encryption key derived from machine-specific info
function getEncryptionKey() {
    try {
        const { machineIdSync } = require('node-machine-id');
        const machineId = machineIdSync();
        const encryptionKey = crypto.createHash('sha256').update(machineId).digest('hex').substring(0, 32);
        logger.log('info', 'Generated encryption key from machine ID');
        return encryptionKey;
    } catch (error) {
        logger.log('warn', 'Failed to get machine ID for encryption, using fallback', { error: error.message });
        // Use a more consistent fallback that's the same in dev and production
        const appName = app.getName();
        const userDataPath = app.getPath('userData');
        
        // Create a consistent fallback key from app name and partial path
        const fallbackKey = crypto.createHash('sha256')
            .update(appName + '_' + userDataPath.split('\\').slice(-2).join('_'))
            .digest('hex')
            .substring(0, 32);
        
        logger.log('info', 'Using fallback encryption key based on app name and user data path');
        return fallbackKey;
    }
}

// Custom simple store implementation that doesn't depend on dot-prop
class SimpleStore {
    constructor(options = {}) {
        this.name = options.name || 'config';
        this.encryptionKey = options.encryptionKey;
        this.userDataPath = app.getPath('userData');
        this.path = path.join(this.userDataPath, `${this.name}.json`);
        this.data = {};
        this.schema = options.schema || {};
        
        // Load data immediately
        this._load();
        
        logger.log('info', 'SimpleStore initialized', { path: this.path });
    }
    
    _load() {
        try {
            if (fs.existsSync(this.path)) {
                const fileContent = fs.readFileSync(this.path, 'utf8');
                
                // Handle different file formats (empty file, etc.)
                if (!fileContent.trim()) {
                    this.data = {};
                    return;
                }
                
                const parsedData = JSON.parse(fileContent);
                
                // Apply decryption if key is available
                if (this.encryptionKey && parsedData && typeof parsedData === 'object') {
                    for (const key in parsedData) {
                        if (typeof parsedData[key] === 'string') {
                            parsedData[key] = decrypt(parsedData[key], this.encryptionKey);
                        }
                    }
                }
                
                this.data = parsedData;
            } else {
                this.data = {};
                // Initialize with defaults from schema
                if (this.schema) {
                    for (const key in this.schema) {
                        if (this.schema[key].default !== undefined) {
                            this.data[key] = this.schema[key].default;
                        }
                    }
                }
                this._save(); // Save defaults
            }
        } catch (error) {
            logger.log('error', 'Failed to load store data', { error: error.message, path: this.path });
            this.data = {};
        }
    }
    
    _save() {
        try {
            // Create directory if it doesn't exist
            const dir = path.dirname(this.path);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            
            // Clone data for saving (avoid modifying original)
            const dataToSave = { ...this.data };
            
            // Apply encryption if key is available
            if (this.encryptionKey) {
                for (const key in dataToSave) {
                    if (typeof dataToSave[key] === 'string') {
                        dataToSave[key] = encrypt(dataToSave[key], this.encryptionKey);
                    }
                }
            }
            
            fs.writeFileSync(this.path, JSON.stringify(dataToSave, null, 2), 'utf8');
            return true;
        } catch (error) {
            logger.log('error', 'Failed to save store data', { error: error.message, path: this.path });
            return false;
        }
    }
    
    get(key) {
        return this.data[key];
    }
    
    set(key, value) {
        this.data[key] = value;
        return this._save();
    }
    
    delete(key) {
        if (key in this.data) {
            delete this.data[key];
            return this._save();
        }
        return true;
    }
    
    has(key) {
        return key in this.data && this.data[key] !== undefined && this.data[key] !== null;
    }
    
    clear() {
        this.data = {};
        return this._save();
    }
}

// Initialize store with encryption
const encryptionKey = getEncryptionKey();
const store = new SimpleStore({
    name: 'api-keys',
    encryptionKey: encryptionKey,
    schema: {
        openai: {
            type: 'string',
            default: ''
        }
    }
});

// API key management functions
const apiKeyManager = {
    /**
     * Get the OpenAI API key
     * @returns {string|null} The API key or null if not set
     */
    getApiKey() {
        try {
            const key = store.get('openai');
            return key || null;
        } catch (error) {
            logger.log('error', 'Error getting OpenAI API key', { error: error.message });
            return null;
        }
    },

    /**
     * Set the OpenAI API key
     * @param {string} key - The API key to store
     * @returns {boolean} Success status
     */
    setApiKey(key) {
        try {
            // First try to delete any existing value
            try {
                store.delete('openai');
            } catch (deleteError) {
                // It's okay if deletion fails (might not exist yet)
                logger.log('info', 'No existing key to delete');
            }

            // Now set the new key
            const result = store.set('openai', key);
            logger.log('info', 'Updated OpenAI API key');
            return result;
        } catch (error) {
            logger.log('error', 'Error setting OpenAI API key', { error: error.message });
            return false;
        }
    },

    /**
     * Delete the OpenAI API key
     * @returns {boolean} Success status
     */
    deleteApiKey() {
        try {
            const result = store.delete('openai');
            logger.log('info', 'Deleted OpenAI API key');
            return result;
        } catch (error) {
            logger.log('error', 'Error deleting OpenAI API key', { error: error.message });
            return false;
        }
    },

    /**
     * Check if an OpenAI API key exists
     * @returns {boolean} Whether a key exists
     */
    hasApiKey() {
        try {
            const hasKey = store.has('openai');
            return hasKey;
        } catch (error) {
            logger.log('error', 'Error checking for OpenAI API key', { error: error.message });
            return false;
        }
    }
};

module.exports = apiKeyManager; 