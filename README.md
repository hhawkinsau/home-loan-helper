# Home Loan Helper

A modern, secure, and privacy-focused tool to visualize home loan repayments, interest, and the effects of RBA rate changes. Built with React, TypeScript, Chakra UI, and a rigorous testing and security-first approach.

## Features

- Simple, reactive UI for entering and adjusting loan details
- Live graph of loan balance, repayments, and interest
- Passkey (WebAuthn) authentication for secure access
- All personal data is encrypted client-side and only decrypted on the frontend
- Minimal and accessible interface, with advanced options expandable
- Fully tested: business logic, encryption, and UI layout

## Tech Stack

- **Frontend:** React + TypeScript, Chakra UI
- **Charting:** Recharts or Victory
- **Forms:** React Hook Form + Zod
- **Testing:** Jest, React Testing Library, Playwright, Storybook
- **Security:** WebAuthn/Passkeys, client-side AES encryption

## Project Structure

```
/src
  /components       # React UI components
  /hooks            # Custom React hooks
  /utils            # Business logic, encryption, calculations
  /assets           # App-specific images, icons, etc.
```
Other folders and configuration files are created by CLI tools (React app initialization, Chakra UI, Storybook, Playwright, etc).

## Development

1. Initialize the project with your preferred React + TypeScript toolchain (Vite/CRA/Next.js).
2. Install Chakra UI, Storybook, Playwright, and other dependencies using their respective CLI commands.
3. Add custom logic and business code in the `/src` subfolders as needed.

## Security

- All user data is encrypted in the browser before any storage or transmission.
- Passkeys (WebAuthn) are used for secure, passwordless authentication.
- The backend (if used) never sees unencrypted data.

## Testing

- All features are covered with unit, integration, and end-to-end tests.
- UI layout and accessibility are tested to ensure a seamless experience.

## License

MIT
