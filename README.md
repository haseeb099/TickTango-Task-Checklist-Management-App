# TickTango: Task & Checklist Management App

[![License](https://img.shields.io/badge/License-0BSD-blue.svg)](https://opensource.org/licenses/0BSD)
[![Built With React Native](https://img.shields.io/badge/Built%20With-React%20Native-61DAFB.svg?logo=react)](https://reactnative.dev/)
[![Powered By Expo](https://img.shields.io/badge/Powered%20By-Expo-000020.svg?logo=expo)](https://expo.dev/)

## 🚀 Overview

TickTango is a robust and intuitive mobile application designed to streamline task and checklist management within organizations. Built with React Native and Expo, it offers a seamless experience for employees, supervisors, and managers to track, assign, and approve tasks efficiently. With features like role-based access, task filtering, sorting, and image attachments, TickTango enhances productivity and ensures accountability across all levels.

## ✨ Features

*   **Role-Based Access Control:** Differentiated functionalities for Employees, Supervisors, and Managers.
*   **Comprehensive Task Management:** Create, view, update, and delete tasks with detailed descriptions and due dates.
*   **Interactive Checklists:** Mark tasks as complete and manage approval workflows.
*   **Advanced Filtering & Sorting:** Easily find tasks by status, role, frequency, priority, and more.
*   **Pagination:** Efficiently navigate through large lists of tasks.
*   **Image Attachments:** Add visual context to tasks with image uploads.
*   **User-Friendly Interface:** Intuitive design built with React Native Paper and custom components.
*   **Cross-Platform Compatibility:** Developed with Expo for seamless deployment on iOS and Android.

## 🛠️ Tech Stack

*   **Framework:** React Native
*   **Development Platform:** Expo
*   **UI Library:** React Native Paper
*   **Navigation:** React Native Tab View, React Native Pager View
*   **Icons:** @expo/vector-icons, react-native-vector-icons
*   **Date/Time Pickers:** @react-native-community/datetimepicker
*   **Image Handling:** expo-image-picker
*   **Styling:** StyleSheet, react-native-linear-gradient
*   **State Management:** React Hooks (useState, useCallback, useEffect)

## 🏁 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Ensure you have Node.js and npm/yarn installed. We recommend using Expo CLI for the best development experience.

```bash
npm install -g expo-cli
# or
yarn global add expo-cli
```

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/MuhammadHaseebRafique/TickTango-Task-Checklist-Management-App.git
    cd TickTango-Task-Checklist-Management-App
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Start the Expo development server:**

    ```bash
    expo start
    ```

    This will open a new tab in your browser with the Expo Dev Tools. You can then run the app on an iOS simulator, Android emulator, or your physical device using the Expo Go app.

## 🏗️ Architecture / How it Works

TickTango follows a component-based architecture typical of React Native applications. The core logic resides in `App.js`, which orchestrates different screens and functionalities:

*   **Authentication:** A `LoginScreen` handles user authentication with predefined roles (employee, supervisor, manager).
*   **Task Management:** The `TasksTab` component displays tasks, allowing users to filter, sort, and paginate through them. It also manages task completion and approval based on user roles.
*   **Task Creation:** The `AddCheckTab` facilitates the creation of new tasks with various attributes like role, frequency, priority, and due date.
*   **Styling:** A centralized `StyleSheet` ensures a consistent and modern UI/UX across the application.

Data is managed using React's local state, demonstrating a clear separation of concerns and efficient UI updates.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the 0BSD License. See `LICENSE` for more information.

## 📞 Contact

Muhammad Haseeb Rafique - [Your Email/LinkedIn/Portfolio Link Here]

Project Link: [https://github.com/MuhammadHaseebRafique/TickTango-Task-Checklist-Management-App](https://github.com/MuhammadHaseebRafique/TickTango-Task-Checklist-Management-App)

---