default:
    @just --list

# Install dependencies
install:
    npm ci

# Start the dev server
dev:
    npm run dev

# Regenerate post metadata and the search index
content:
    npm run content

# Build the static site into .output/public
build:
    npm run build

# Serve the built static output
serve: build
    npm run serve

# Type-check the project
check:
    npm run typecheck

# Create a new draft post: just new "My title"
new title:
    npm run new -- "{{title}}"

# Create a new draft paper summary: just paper "Paper title"
paper title:
    npm run new -- "{{title}}" --paper

# Remove build artefacts
clean:
    rm -rf .output .vinxi src/lib/posts.generated.json public/search-index.json
