# Installing act (GitHub Actions locally)

Choose one of these installation methods:

## Option 1: Install with Homebrew (if you have it)
```bash
brew install act
```

## Option 2: Install with snap
```bash
sudo snap install act
```

## Option 3: Download binary directly
```bash
# For Linux x64
curl -sL https://github.com/nektos/act/releases/latest/download/act_Linux_x86_64.tar.gz | tar xz
sudo mv act /usr/local/bin/act
sudo chmod +x /usr/local/bin/act
```

## Option 4: Install to user's local bin (no sudo needed)
```bash
# Create local bin directory if it doesn't exist
mkdir -p ~/.local/bin

# Download and extract
curl -sL https://github.com/nektos/act/releases/latest/download/act_Linux_x86_64.tar.gz | tar xz -C ~/.local/bin

# Add to PATH if not already there (add to ~/.bashrc or ~/.zshrc)
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

## Option 5: Using Go (if you have Go installed)
```bash
go install github.com/nektos/act@latest
```

## Verify installation
```bash
act --version
```

After installing, you can run:
```bash
./scripts/test-github-action.sh
```