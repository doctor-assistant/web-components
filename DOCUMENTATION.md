# Project Documentation

## Overview

This project is a web component library built using Stencil. It provides reusable components that can be integrated into various web applications.

## Getting Started

To get started with this project, clone the repository and install the dependencies:

```bash
git clone https://github.com/octor-assistant/web-components.git
cd web-components
npm install
```

## Development

To start the development server, run:

```bash
npm start
```

This will build the project in development mode and serve it locally.

## Building

To build the project for production, use:

```bash
npm run build
```

This will generate the production-ready files in the `dist` directory.

## Testing

To run the tests, execute:

```bash
npm test
```

For end-to-end tests, use:

```bash
npm run test:e2e
```

## Deployment

### Latest Version

To deploy the latest version of the project, you can trigger the GitHub Actions workflow defined in `.github/workflows/deploy-latest.yml`. This workflow will run end-to-end tests, build the project, and publish the package to npm with the "latest" tag.

### Release Candidate

For deploying a release candidate version, trigger the workflow defined in `.github/workflows/deploy-rc.yml`. This will also run end-to-end tests, build the project, and publish the package to npm with the "rc" tag.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.