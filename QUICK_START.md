# 🚀 Quick Start Guide

## Installation & Setup

```bash
# 1. Navigate to project
cd finanapp

# 2. Install dependencies
npm install

# 3. Start the app
npm start

# 4. Choose platform
# Press 'i' for iOS
# Press 'a' for Android  
# Press 'w' for Web
```

---

## 🧪 Testing Checklist

### ✅ Demo Credentials
```
Email: demo@example.com
Password: (any 6+ characters)
Backup Email: john.backup@example.com
Demo OTP: 123456
```

---

## 📋 Feature Testing Walkthrough

### Test 1: Normal Login (LOW RISK)
```
1. Open app → Login Screen
2. Enter: demo@example.com
3. Enter any password (e.g., "password")
4. Login → Dashboard (immediate access)
5. ✅ Should show balance: ₹4,50,000
```

### Test 2: Send Money (LOW RISK)
```
1. From Dashboard → Click "Send Money"
2. Recipient: Sarah Smith
3. Amount: ₹5,000
4. Click "Send Money" → Success
5. ✅ Should confirm successful transaction
```

### Test 3: Suspicious Login (HIGH RISK)
```
1. Restart app or clear auth state
2. Login again with same credentials
3. ✅ Should see: "⚠️ Suspicious Login Detected"
4. Click "Continue to Verification"
5. Should show OTP Verification Screen
```

### Test 4: OTP Verification
```
1. On OTP screen, enter: 123456
2. ✅ Should show: "Verification Successful"
3. Click "Continue"
4. ✅ Now on Dashboard with LOW RISK status
```

### Test 5: Send Money (HIGH RISK - Blocked)
```
1. Trigger HIGH RISK login (logout + relog)
2. Before OTP verification, click "Send Money"
3. ✅ Should show: "Transaction Blocked" alert
4. Must complete OTP first
```

### Test 6: Emergency Mode
```
1. From Dashboard → Click "Emergency"
2. Shows warning: "I Lost My Phone"
3. Check the confirmation box
4. Click "Lock Account Now"
5. ✅ Should show: "Account locked successfully"
6. ✅ Should be logged out
7. Recovery Screen appears
```

### Test 7: Account Recovery
```
1. On Recovery Screen → "Start Recovery"
2. Enter email: demo@example.com
3. Click "Send OTP"
4. ✅ Should see demo OTP: [random number]
5. Enter Backup Email: john.backup@example.com
6. Enter OTP: 123456
7. Click "Unlock Account"
8. ✅ Should auto-login and show Dashboard
```

### Test 8: Trusted Devices
```
1. From Dashboard → Click "Trusted Devices"
2. ✅ Should see list of devices used for login
3. Shows: Device ID, Location, Last Seen
4. All marked as "✓ Trusted"
```

---

## 🔍 File Structure Verification

### Core Files
```
✅ AppContent.tsx              → Main app orchestrator
✅ app/_layout.tsx             → Root layout
✅ context/AuthContext.tsx     → State management
```

### Screens (8 total)
```
✅ screens/LoginScreen.tsx
✅ screens/SignUpScreen.tsx
✅ screens/DashboardScreen.tsx
✅ screens/OTPVerificationScreen.tsx
✅ screens/SendMoneyScreen.tsx
✅ screens/EmergencyModeScreen.tsx
✅ screens/RecoveryScreen.tsx
✅ screens/TrustedDevicesScreen.tsx
```

### Utilities
```
✅ utils/auth.ts
✅ utils/riskDetection.ts
✅ utils/mockData.ts
✅ utils/storage.ts
```

---

## 🔑 Key Features to Highlight

| Feature | Location | Status |
|---------|----------|--------|
| Risk Detection | LoginScreen → RiskDetection | ✅ |
| OTP Verification | OTPVerificationScreen | ✅ |
| Transaction Blocking | SendMoneyScreen + DashboardScreen | ✅ |
| Emergency Lockdown | EmergencyModeScreen | ✅ |
| Account Recovery | RecoveryScreen | ✅ |
| Device Tracking | TrustedDevicesScreen | ✅ |
| Session Persistence | AsyncStorage + AuthContext | ✅ |
| Mock Auth | utils/auth.ts | ✅ |

---

## 🎯 Screen Navigation Map

```
Login Screen
├── Sign Up → Sign Up Screen → Login Screen
├── Recovery → Recovery Screen → Login/Dashboard
└── Login Success
    ├── HIGH RISK → OTP Verification → Dashboard
    └── LOW RISK → Dashboard (direct)

Dashboard Screen
├── Send Money → Send Money Screen → Dashboard
├── Emergency → Emergency Mode Screen → Account Locked
├── Logout → Login Screen
└── Trusted Devices → Trusted Devices Screen → Dashboard

Account Locked
└── Recovery → Recovery Screen → Dashboard (auto-login)
```

---

## 📱 Platform-Specific Notes

### iOS
- SafeAreaView handles notch
- Tab bar at bottom
- Swipe back gesture supported

### Android
- EdgeToEdge enabled in app.json
- Back gesture handled via hardware button
- Material follow

### Web
- Responsive design via flex
- Touch targets sized for mouse clicks
- ScrollView renders as overflow

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot find module '@react-native-async-storage/async-storage'"
**Solution**: Run `npm install @react-native-async-storage/async-storage`

### Issue: App doesn't start
**Solution**: 
1. Delete node_modules: `rm -r node_modules`
2. Reinstall: `npm install`
3. Clear cache: `npm start -- --clear`

### Issue: Stuck on splash screen
**Solution**:
1. Check console for errors: `npm start`
2. Reload with `r` key
3. Restart with `npm start -- --clear`

### Issue: Styles not applying
**Solution**:
1. Clear React Native cache
2. Restart metro bundler
3. Restart app from platform launcher

---

## 💡 Pro Tips

1. **Reset All Data**: Uninstall app and reinstall (removes AsyncStorage)
2. **Test HIGH RISK**: Each app restart = new device ID = HIGH RISK
3. **Demo OTP**: Type `123456` for all OTP prompts
4. **Change Location**: App generates random city per device ID
5. **View Logs**: Check console in `npm start` terminal

---

## 📊 Data Flow Example

```
User Login
├── Generate Device ID + Location
├── Check Risk (compareWith Known Devices)
├── Save Session + Risk Level → AsyncStorage
├── If HIGH RISK:
│   ├── Show OTP Screen
│   ├── Verify OTP → Set Risk to LOW
│   └── Update Storage
└── Navigate to Dashboard

Emergency Lock
├── Set Account Locked Flag → Storage
├── Clear Session → Storage
├── Logout User → Clear Auth State
└── Show Recovery Screen

Account Recovery
├── Verify Email + Backup Email + OTP
├── Set Account Locked to False
├── Create New Session
├── Auto-login and Navigate to Dashboard
└── Update All Storage
```

---

## ✨ Code Quality

- ✅ TypeScript throughout
- ✅ Comments on complex logic
- ✅ Reusable utilities
- ✅ Clean component architecture
- ✅ Proper error handling
- ✅ Mock data separation
- ✅ State management pattern
- ✅ Responsive design

---

## 🎓 Learning Resources

### In the Codebase
- **Risk Detection**: `utils/riskDetection.ts` - Device tracking logic
- **State Management**: `context/AuthContext.tsx` - React Context pattern
- **Conditional Rendering**: `AppContent.tsx` - Screen navigation
- **Forms**: `screens/LoginScreen.tsx` - Input handling
- **Alerts**: All screens - User feedback patterns

### Key Patterns
1. **Context API** for global state
2. **Custom Hooks** via `useAuth()`
3. **AsyncStorage** for persistence
4. **Type Safety** with TypeScript interfaces
5. **Functional Components** with Hooks
6. **Error Boundaries** via try-catch
7. **Loading States** with ActivityIndicator

---

## 🎯 Hackathon Talking Points

- "Built a complete financial security flow with risk detection"
- "Implemented device & location tracking for fraud prevention"
- "Emergency account lockdown feature for lost phone scenarios"
- "Mock OTP verification system simulating real 2FA"
- "Transaction blocking based on risk assessment"
- "Account recovery flow with backup email verification"
- "Clean architecture with separated concerns"
- "Ready for backend integration without code refactoring"

---

## 📞 Support Commands

```bash
# View current status
npm start

# Check for errors
npm run lint

# Update dependencies
npm install

# Clean reinstall
rm -r node_modules && npm install

# View Android logs
adb logcat

# Clear all app data
# (via system settings on device)
```

---

**Ready to impress! 🚀**
