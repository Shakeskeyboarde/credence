# credenv

Run a command with credential environment variables loaded from a file.

## Usage

Install `credenv` globally.

```sh
npm install --global credenv
```

Make sure you add `.creds*` files to your `.gitignore` file.

```sh
# Filename: `.gitignore`
.creds*
```

Create a credentials environment file for a command (eg. `aws`).

```sh
# Filename: `.creds-aws`
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
DEFAULT_REGION="..."
```

Run the command command with the `credenv` (or `cv` for short) wrapper.

```sh
credenv aws get-caller-identity
```

The `credenv` wrapper will load environment variables from a file named `.creds-aws` in the current directory or a parent directory, and then execute the command.
