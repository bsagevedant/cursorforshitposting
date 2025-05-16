# Shitpost Generator

A fun AI-powered application to generate viral-worthy content for social media.

## Features

- Generate customized shitposts with various tones and styles
- Save your favorite generations
- Credit-based system with 2 free credits for new users
- Integrated payment system for purchasing additional credits
- User authentication via Firebase

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following content:
```
# Payment API Keys
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

4. Start the development server:
```bash
npm run dev
```

## Firebase Authentication Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project
2. Add a web app to your Firebase project:
   - Click on the web icon (</>) in the Firebase dashboard
   - Register your app with a nickname
   - No need to set up Firebase Hosting for this step
   - Click "Register app"
3. Copy the Firebase configuration object
4. Add the Firebase configuration values to your `.env.local` file
5. Enable Authentication in the Firebase Console:
   - Go to Authentication > Sign-in method
   - Enable the Email/Password provider
   - Optionally enable Google authentication
   - Save the changes
6. Users can now sign up, sign in, and reset their passwords through the application

## Payment Integration

### Razorpay Setup

1. Sign up for a Razorpay account at [razorpay.com](https://razorpay.com)
2. Get your API key from the Razorpay Dashboard:
   - Go to Dashboard > Settings > API Keys
   - Generate a new key pair
   - Copy the "Key ID" (not the Secret Key)
3. Add your key to the `.env.local` file:
```
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id
```

### PayPal Setup

1. Sign up for a PayPal Developer account at [developer.paypal.com](https://developer.paypal.com)
2. Create a new app in the PayPal Developer Dashboard:
   - Go to Dashboard > My Apps & Credentials
   - Click "Create App" under the REST API apps section
   - Give your app a name (e.g., "Shitpost Generator")
   - Select "Merchant" as the app type
   - Click "Create App"
3. Get your Client ID from the newly created app
4. Add your Client ID to the `.env.local` file:
```
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
```

#### PayPal Sandbox Testing

For testing PayPal integration, you can use the following sandbox accounts:

1. **Buyer Account**:
   - Email: sb-buyer@example.com
   - Password: test1234

2. **Credit Card**:
   - Card Type: Visa
   - Card Number: 4111111111111111
   - Expiration Date: Any future date
   - CVV: Any 3 digits

## Credit System

- New users receive 2 free credits
- Each shitpost generation costs 1 credit
- Users can purchase 20 additional credits for $9 via Razorpay or PayPal

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Firebase Authentication
- Razorpay
- PayPal

## License

This project is licensed under the MIT License. 