const Store = require('electron-store');
// Add fallback for conf module in case it's still not found
try {
    require('conf');
} catch (error) {
    console.log('Warning: conf module not found, using fallback mechanism');
}
const crypto = require('crypto');
const logger = require('./logger');

// Simple encryption key derived from machine-specific info
// This isn't perfect security but adds a layer of protection
function getEncryptionKey() {
    try {
        const { machineIdSync } = require('node-machine-id');
        const machineId = machineIdSync();
        return crypto.createHash('sha256').update(machineId).digest('hex').substring(0, 32);
    } catch (error) {
        logger.log('warn', 'Failed to get machine ID for encryption, using fallback', { error: error.message });
        // Fallback to a less secure but still somewhat unique key
        return crypto.createHash('sha256')
            .update(process.env.USER_DATA_PATH || 'fe-infinity-default-key')
            .digest('hex')
            .substring(0, 32);
    }
}

// Initialize secure store with encryption
const store = new Store({
    name: 'api-keys', // Separate file for API keys
    encryptionKey: getEncryptionKey(), // Encryption for additional security
    // Only store specific keys we expect
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
            // First try to delete any existing value to avoid "Use `delete()` to clear values" error
            try {
                store.delete('openai');
            } catch (deleteError) {
                // It's okay if deletion fails (might not exist yet)
                logger.log('info', 'No existing key to delete');
            }

            // Now set the new key
            store.set('openai', key);
            logger.log('info', 'Updated OpenAI API key');
            return true;
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
            store.delete('openai');
            logger.log('info', 'Deleted OpenAI API key');
            return true;
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
            const key = store.get('openai');
            return !!key;
        } catch (error) {
            logger.log('error', 'Error checking for OpenAI API key', { error: error.message });
            return false;
        }
    }
};

module.exports = apiKeyManager; 