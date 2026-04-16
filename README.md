# FCC JavaScript Calculator

React calculator handling standard arithmetic with order-of-operations evaluation, built for the FreeCodeCamp Front End Libraries certification.

## Features

- Digits 0–9, decimal point, and operators (+, -, x, /) entered via buttons or keyboard; `Escape` clears, `Enter` evaluates, and `*` is accepted as `x`.
- Chained-input buffering: operands and operators collected in an expression buffer and evaluated on `=`.
- Order-of-operations arithmetic via `eval` on the accumulated expression (with `x` mapped to `*`)
- Consecutive-operator handling: last operator wins; the formula display is trimmed accordingly
- AC (All Clear) resets display, formula, and stack to initial state
- Formula bar shows the full current expression; output display shows the running value or result

## Tech Stack

- React 17 — class components with typed props and state
- TypeScript
- Vite
- Sass — component-scoped `.scss` stylesheets

## Requirements

- Node.js 18+
- Yarn 1.x (matching the `yarn.lock` in the repo)

## Installation

```bash
yarn install
```

## Usage

```bash
yarn dev
```

Open `http://localhost:5173` in your browser.

## Build

```bash
yarn build
```

## Project Structure

```
.
├── src/
├── index.html
├── package.json
└── README.md
```

## License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file.
