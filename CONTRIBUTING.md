# Contributing to @wfpena/angular-wysiwyg

Thank you for considering contributing to the Angular WYSIWYG project! Contributions are essential for improving the project and making it more robust.

## How to Contribute

### Reporting Issues

If you encounter a bug or have a suggestion, please open an issue on the GitHub repository. Provide a clear and detailed description of the issue, including steps to reproduce it. If possible, include screenshots or code snippets that demonstrate the problem.

You can help make this project better by submitting issues and feature ideas on the [repo issues page](https://github.com/wfpena/angular-wysiwyg/issues).


### Pull Requests

We welcome contributions in the form of pull requests. To submit a pull request:

1. **Fork the repository.**
2. **Clone your fork to your local machine:**

   ```bash
   git clone https://github.com/your-username/angular-wysiwyg.git
	```
3. **Create a new branch for your changes:**
   ```bash
   git checkout -b feature-or-fix-branch
   ```
4. **Make your changes and commit them:**
   ```bash
   git commit -m "Your descriptive commit message"
   ```
5. **Push your changes to your fork:**
   ```bash
   git push origin feature-or-fix-branch
   ```
6. **Open a pull request on the GitHub repository.**

### Development Setup

To set up the project for local development:

1. **Install dependencies:**
   ```bash
   yarn install
   ```
2. **Run the development server:**
   ```bash
   yarn start
   ```
3. **Open your browser and navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.**

## Running tests

### Cypress E2E test:

* **To run cypress with the interface**:

```bash
yarn cypress:open:app
```

> :info:
> Its set on `package.json` to run on chrome by default.
> If you want to change the default browser (or change browsers through the interface) alter the `cypress:open:app` command on `package.json`

```json
"cypress:open:app": "ng run angular-editor-app:cypress-open --browser chrome",
```

* **To run cypress with the interface:**

```bash
yarn cypress:run:app
```

### Unit tests:

* Testing the lib:

```bash
yarn test:lib
```

* Testing with the demo app:

```bash
yarn test
```

### Coding Guidelines

Please follow the existing coding style and conventions used in the project. If you are adding new features or modifying existing ones, make sure to include appropriate tests.

### Commit Messages

Write clear and descriptive commit messages that explain the purpose of your changes. Follow the conventional commit format, such as:
- `feat: add new feature`
- `fix: resolve a bug`
- `chore: make a maintenance change`
- `refactor: refactoring or improving code`

## Thank You!

Your contributions are valuable, and we appreciate your efforts in making Angular WYSIWYG even better!

Happy coding!