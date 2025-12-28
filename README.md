# TodoApp 📋

A beautiful and feature-rich todo mobile application built with React Native and Expo. Manage your tasks with priorities, categories, deadlines, and notifications.

## ✨ Features

- **Task Management**: Create, edit, delete, and mark tasks as complete
- **Priority Levels**: Set task priorities (Low, Medium, High, Urgent)
- **Categories**: Organize tasks by category (Personal, Work, Shopping, Health, Other)
- **Status Tracking**: Track task progress (Pending, In Progress, Completed)
- **Deadlines & Reminders**: Set due dates and reminder notifications
- **Search & Filter**: Find tasks quickly with search and advanced filtering
- **Statistics**: View productivity analytics and completion rates
- **Themes**: Support for light and dark themes
- **Animations**: Smooth animations and haptic feedback
- **Offline Storage**: Local data persistence with AsyncStorage

## 🚀 Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- For Android development: Android Studio or Expo Go app
- For iOS development: Xcode (macOS only)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/VIJAYANANDANJM/todoApp.git
   cd todoApp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   # or
   npx expo start
   ```

4. Run on your device:
   - **Expo Go**: Scan the QR code with the Expo Go app
   - **Android Emulator**: Press `a` in the terminal
   - **iOS Simulator**: Press `i` in the terminal (macOS only)
   - **Web**: Press `w` in the terminal

## 📱 Building APK for Android

### Method 1: Using Expo Application Services (EAS) - Recommended

1. Install EAS CLI:
   ```bash
   npm install -g @expo/eas-cli
   ```

2. Login to your Expo account:
   ```bash
   eas login
   ```

3. Configure your project for EAS:
   ```bash
   eas build:configure
   ```

4. Build for Android:
   ```bash
   eas build --platform android
   ```

5. Choose build type:
   - **Development**: For testing and development
   - **Production**: For release to app stores

6. Download the APK from the provided URL once the build completes.

### Method 2: Local Build (Advanced)

1. Install Android Studio and set up Android SDK
2. Configure environment variables for Android SDK
3. Generate a keystore for signing:
   ```bash
   keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```

4. Add keystore configuration to `app.json`:
   ```json
   {
     "expo": {
       "android": {
         "package": "com.yourcompany.todoapp",
         "permissions": ["android.permission.RECEIVE_BOOT_COMPLETED", "android.permission.VIBRATE"],
         "config": {
           "googleServicesFile": "./google-services.json"
         }
       }
     }
   }
   ```

5. Build the APK:
   ```bash
   npx expo build:android
   ```

## 🏗️ Project Structure

```
todoApp/
├── app/                    # App screens (file-based routing)
│   ├── _layout.tsx        # Root layout
│   ├── modal.tsx          # Add/Edit todo modal
│   └── (tabs)/            # Tab navigation
│       ├── _layout.tsx    # Tab layout
│       ├── index.tsx      # Main todo list
│       └── explore.tsx    # Statistics screen
├── components/            # Reusable components
│   ├── TodoItem.tsx       # Individual todo item
│   ├── AddTodoButton.tsx  # Floating action button
│   ├── DatePickerModal.tsx # Date/time picker
│   └── ui/                # UI components
├── constants/             # App constants
│   └── theme.ts          # Colors and themes
├── hooks/                 # Custom hooks
├── types/                 # TypeScript type definitions
│   └── todo.ts           # Todo data types
├── utils/                 # Utility functions
│   ├── storage.ts        # Data persistence
│   ├── notifications.ts  # Push notifications
│   └── helpers.ts        # Helper functions
└── assets/               # Static assets
```

## 🛠️ Technologies Used

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and SDK
- **TypeScript**: Type-safe JavaScript
- **AsyncStorage**: Local data storage
- **Expo Notifications**: Push notifications
- **React Native Reanimated**: Smooth animations
- **Expo Router**: File-based routing
- **Expo Vector Icons**: Icon library

## 📋 Usage

### Adding a Todo
1. Tap the "+" button in the bottom right
2. Enter a title and optional description
3. Set priority, category, and status
4. Optionally set deadline and reminder time
5. Tap "Create Todo"

### Managing Todos
- **Complete**: Tap the checkbox next to a todo
- **Edit**: Tap on any todo item
- **Delete**: Long press on a todo item
- **Filter**: Use the filter button to sort and filter todos
- **Search**: Use the search bar to find specific todos

### Notifications
- Set reminder times when creating/editing todos
- Grant notification permissions when prompted
- Receive push notifications at scheduled times

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request



## 🙋‍♂️ Support

If you have any questions or issues, please open an issue on GitHub or contact the maintainers.

## 🔧 Troubleshooting

### Build Issues

**EAS Build Fails**
- Ensure you have the latest EAS CLI: `npm install -g @expo/eas-cli`
- Login to Expo: `eas login`
- Check your app.json configuration
- Verify all required assets exist

**Notification Permissions**
- Grant notification permissions when prompted
- For Android: Check app settings > permissions
- For iOS: Check Settings > Notifications > TodoApp

**Storage Issues**
- Clear app data if todos don't persist
- Check AsyncStorage permissions

### Development Issues

**Metro Bundler Issues**
```bash
npm start --clear
# or
npx expo start --clear
```

**TypeScript Errors**
```bash
npm run lint
```

**Reset Project**
```bash
npm run reset-project
```
