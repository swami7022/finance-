# 🔐 Secure Finance Recovery App

A React Native Expo mobile app demonstrating financial security best practices, including risk-based access control, device verification, emergency lockdown, and recovery mechanisms.

## 🎯 Features

### 1. **Authentication System**
- **Login Screen**: Email-based authentication with mock credentials
- **Sign Up Screen**: Create new accounts with backup email
- **Mock Authentication**: Credentials stored locally (demo email: `demo@example.com`)
- **Session Management**: AsyncStorage for secure session persistence

### 2. **Device & Location Risk Detection**
- **Device ID Simulation**: Each device gets a unique identifier
- **Location Simulation**: Random city selection to simulate geographic diversity
- **Risk Classification**:
  - ✅ **LOW RISK**: Known device with recognized location
  - ⚠️ **HIGH RISK**: New device or different location detected

### 3. **Risk-Based Access Control**
- **Automatic Risk Detection**: Evaluated on login
- **OTP Verification**: Required for high-risk logins
- **Transaction Blocking**: High-risk users cannot send money until verified
- **Demo OTP**: `123456` for testing verification

### 4. **Dashboard Screen**
- 💰 Display user balance
- 📋 Recent transactions list
- 💸 Send Money button (disabled if high risk)
- 📱 Trusted Devices viewer
- 🆘 Emergency Mode button

### 5. **Transaction Protection**
- ✅ Allowed for LOW RISK users
- 🚫 Blocked for HIGH RISK users with warning message
- Mock transaction processing

### 6. **Emergency Mode**
- **"I Lost My Phone" Feature**: One-click account lockdown
- Immediate logout from current device
- Account flagged as locked
- Prevents unauthorized access

### 7. **Recovery System**
- **Backup Email Recovery**: Unlock account via backup email + OTP
- **Device Verification**: Reset risk level on successful recovery
- **Account Unlock**: Automatic login after recovery completion

---

## 📁 Project Structure

```
finanapp/
├── app/
│   ├── _layout.tsx          # Root layout
│   ├── modal.tsx
│   └── (tabs)/
│
├── screens/                  # All screen components
│   ├── LoginScreen.tsx
│   ├── SignUpScreen.tsx
│   ├── DashboardScreen.tsx
│   ├── OTPVerificationScreen.tsx
│   ├── SendMoneyScreen.tsx
│   ├── EmergencyModeScreen.tsx
│   ├── RecoveryScreen.tsx
│   └── TrustedDevicesScreen.tsx
│
├── context/                  # State management
│   └── AuthContext.tsx       # Auth + Risk state
│
├── utils/                    # Business logic
│   ├── auth.ts              # Authentication utilities
│   ├── riskDetection.ts     # Risk assessment logic
│   ├── mockData.ts          # Mock user data
│   └── storage.ts           # AsyncStorage helpers
│
├── components/              # Reusable components
├── hooks/                   # Custom React hooks
├── constants/               # Constants & theme
│
├── AppContent.tsx           # Main app orchestrator
├── package.json
├── app.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g expo-cli`

### Installation

1. **Navigate to project**:
   ```bash
   cd finanapp
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the app**:
   ```bash
   npm start
   ```

4. **Run on platform**:
   - iOS: Press `i`
   - Android: Press `a`
   - Web: Press `w`

---

## 🧪 Testing the App

### Demo Credentials
- **Email**: `demo@example.com`
- **Password**: Any password (6+ characters)
- **Backup Email**: `john.backup@example.com` (for recovery)
- **Demo OTP**: `123456`

### User Flow

#### 1️⃣ **Normal Login (LOW Risk)**
- Login from a known device/location
- Access dashboard immediately
- Full transaction capabilities

#### 2️⃣ **Suspicious Login (HIGH Risk)**
- Simulate new device (generates new device ID)
- Triggers "Suspicious Login Detected" alert
- OTP verification screen appears
- Enter demo OTP: `123456`
- After verification → LOW RISK → Access dashboard

#### 3️⃣ **Send Money**
- LOW RISK: Can initiate transaction
- HIGH RISK: Shows "Transaction Blocked" warning
- Must verify OTP first

#### 4️⃣ **Emergency Mode**
- Click "Emergency" button on dashboard
- Click "I Lost My Phone"
- Confirm action
- Account locks immediately
- Logged out automatically
- Recovery screen appears

#### 5️⃣ **Account Recovery**
- Enter email: `demo@example.com`
- Send OTP
- Enter backup email: `john.backup@example.com`
- Enter OTP: `123456`
- Account unlocked → Auto-login → Dashboard

#### 6️⃣ **View Trusted Devices**
- Shows all devices that have logged in
- Displays device ID, location, and last seen time
- Updates as you login from different simulated devices

---

## 🔧 Key Implementation Details

### Risk Detection Logic
```typescript
// File: utils/riskDetection.ts
- New device (not in known devices) = HIGH RISK
- Different location = HIGH RISK
- Known device + same location = LOW RISK
- Device is registered after first login
```

### State Management
```typescript
// File: context/AuthContext.tsx
- isLoggedIn: User authentication status
- riskLevel: Current session risk (LOW/HIGH)
- accountLocked: Emergency mode flag
- Methods: login(), logout(), lockAccount(), unlockAccount()
```

### Secure Storage
```typescript
// File: utils/storage.ts
- Uses AsyncStorage (encrypted on device)
- Stores: User session, risk level, account lock status
- Cleared on logout or app uninstall
```

### Authentication Flow
```typescript
// File: utils/auth.ts
- validateLogin(): Check credentials against mock database
- validateSignup(): Validate all fields and requirements
- validateRecovery(): Verify backup email + OTP
```

---

## 🎨 UI/UX Features

### Color Scheme
- **Primary**: #007AFF (Blue) - Main actions
- **Success**: #4CAF50 (Green) - Positive actions
- **Danger**: #FF6B6B (Red) - Urgent/Emergency
- **Warning**: #FF9800 (Orange) - Caution/High Risk
- **Info**: #E3F2FD (Light Blue) - Information

### Alert States
- ⚠️ **High Risk**: Orange-tinted balance card + warning alert
- 🆘 **Account Locked**: Recovery screen enforced
- ✅ **Verified**: Green success states

### Responsive Design
- Safe areas handled via `SafeAreaView`
- ScrollView for content overflow
- Touch feedback on buttons

---

## 📱 Components Breakdown

### LoginScreen
- Email and password input
- Mock authentication
- Risk detection on login
- Links to signup and recovery

### OTPVerificationScreen
- 6-digit OTP input
- Demo OTP display
- 60-second resend timer
- Converts HIGH RISK to LOW on success

### DashboardScreen
- User greeting and balance
- Risk status alert (if HIGH)
- Action buttons: Send Money, Trusted Devices, Emergency
- Recent transactions list
- Security tips

### SendMoneyScreen
- High-risk blocking logic
- Recipient name input
- Amount input with validation
- Balance check
- Free transaction fee

### EmergencyModeScreen
- Clear warning message
- Confirmation checkbox
- Immediate account lock action
- Contact support link

### RecoveryScreen
- Two-step process: Email verification → OTP verification
- Backup email confirmation
- Auto-login after successful recovery

### TrustedDevicesScreen
- List all known devices
- Device ID, location, last seen time
- Visual indicators for trusted status

---

## 🔐 Security Considerations

### Implemented
✅ AsyncStorage for session persistence  
✅ Mock OTP verification  
✅ Device tracking system  
✅ Location-based risk detection  
✅ Emergency account lockdown  
✅ Recovery mechanism  
✅ Transaction blocking for high-risk users  

### Not Implemented (Out of Scope)
- ❌ Real backend integration
- ❌ Actual device-native secure storage
- ❌ Real network encryption
- ❌ Biometric authentication
- ❌ Push notifications (mentioned as bonus)

---

## 📚 Main Files to Review

| File | Purpose |
|------|---------|
| `context/AuthContext.tsx` | Authentication & state management |
| `utils/riskDetection.ts` | Core risk detection logic |
| `screens/LoginScreen.tsx` | Login flow with risk detection |
| `screens/OTPVerificationScreen.tsx` | High-risk verification |
| `screens/DashboardScreen.tsx` | Main app dashboard |
| `screens/EmergencyModeScreen.tsx` | Account lockdown feature |
| `screens/RecoveryScreen.tsx` | Account recovery logic |
| `AppContent.tsx` | Screen navigation orchestration |

---

## 🎓 Learning Outcomes

This app demonstrates:
- ✅ React Native with Expo best practices
- ✅ Functional components and Hooks
- ✅ Context API for state management
- ✅ AsyncStorage for local persistence
- ✅ Risk-based conditional logic
- ✅ Mock data for realistic scenarios
- ✅ Clean code organization
- ✅ Security-focused UI patterns
- ✅ Account recovery flows
- ✅ Device tracking systems

---

## 🚀 Future Enhancements

1. **Push Notifications**: Alert on suspicious logins
2. **Animations**: Smooth transitions between screens
3. **Biometric Auth**: Fingerprint/Face ID support
4. **Real Backend**: Connect to actual authentication API
5. **Transaction History**: Detailed view with filters
6. **Device Management**: Remove trusted devices
7. **Password Reset**: Secure password change flow
8. **Multi-factor Auth**: SMS + Email verification
9. **Transaction Limits**: Risk-based spending limits
10. **Fraud Detection**: Advanced risk scoring

---

## 📝 License

This is a hackathon demo project for educational purposes.

---

## 💡 Key Takeaways for Hackathon

**Focus**: Functionality over design  
**Architecture**: Modular and maintainable  
**Security**: Demonstrates real-world patterns  
**Scalability**: Ready for backend integration  
**User Experience**: Intuitive flow for emergency scenarios  

---

## 🤝 Support

For questions or issues, refer to the inline code comments in:
- `utils/auth.ts` - Authentication logic
- `utils/riskDetection.ts` - Risk scoring
- `context/AuthContext.tsx` - State management
- Screen components - UI implementation details

---

**Happy Hacking! 🚀**
