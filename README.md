# FE Infinity Lex Talionis

## Installation

To add in the `lt-maker` submodule, run the following command:

```bash
git submodule update --init --recursive
```

## Development

### Making Deno Easier

```bash
alias dr='deno run --allow-all'
```

which allows you to call `dr path/to/file.ts` instead of `deno run --allow-all path/to/file.ts`.


### Updating lt-maker

If `lt-maker` has new commits that you want, run:

```bash
cd lt-maker
git pull origin main
cd ..
git commit -am "Update lt-maker submodule pointer"
```
