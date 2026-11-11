import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TopBar } from './components/common/TopBar';
import { ToastContainer } from './components/common/ToastContainer';
import { ReceiptModal } from './components/common/ReceiptModal';
import { QuickSearchModal } from './components/common/QuickSearchModal';
import { ScenarioRunnerModal } from './components/common/ScenarioRunnerModal';
import { ThemeCustomizerModal } from './components/common/ThemeCustomizerModal';
import { WelcomeScreen } from './components/welcome/WelcomeScreen';
import { PrincipalView } from './components/roles/principal/PrincipalView';
import { VicePrincipalView } from './components/roles/viceprincipal/VicePrincipalView';
import { TeacherView } from './components/roles/teacher/TeacherView';
import { AccountantView } from './components/roles/accountant/AccountantView';
import { ReceptionistView } from './components/roles/receptionist/ReceptionistView';
import { LibrarianView } from './components/roles/librarian/LibrarianView';
import { HRStaffView } from './components/roles/hr/HRStaffView';
import { TransportView } from './components/roles/transport/TransportView';
import { ExamCoordinatorView } from './components/roles/examcoordinator/ExamCoordinatorView';
import { MobileShell } from './components/roles/mobile/MobileShell';
import { TeacherMobile } from './components/roles/mobile/TeacherMobile';
import { ParentMobile } from './components/roles/mobile/ParentMobile';

const AppContent: React.FC = () => {
  const { isWelcomeScreen, currentRole, isThemeModalOpen, setIsThemeModalOpen } = useApp();

  if (isWelcomeScreen) {
    return (
      <>
        <WelcomeScreen />
        <ThemeCustomizerModal
          isOpen={isThemeModalOpen}
          onClose={() => setIsThemeModalOpen(false)}
        />
        <ToastContainer />
      </>
    );
  }

  const roleTitles: Record<string, string> = {
    teacher_mobile: 'SCHLAR Teacher Mobile App',
    parent_mobile: 'SCHLAR Parent Mobile App'
  };

  return (
    <div className="min-h-screen bg-theme-bg flex flex-col font-sans transition-colors duration-200">
      <TopBar />

      <div className="flex-1 flex flex-col">
        {/* Approved Web Roles */}
        {currentRole === 'principal' && <PrincipalView />}
        {currentRole === 'vice_principal' && <VicePrincipalView />}
        {currentRole === 'teacher' && <TeacherView />}
        {currentRole === 'accountant' && <AccountantView />}
        {currentRole === 'hr' && <HRStaffView />}
        {currentRole === 'librarian' && <LibrarianView />}
        {currentRole === 'transport' && <TransportView />}
        {currentRole === 'receptionist' && <ReceptionistView />}
        {currentRole === 'exam_coordinator' && <ExamCoordinatorView />}

        {/* Mobile Roles */}
        {currentRole === 'teacher_mobile' && (
          <MobileShell activeRoleTitle={roleTitles.teacher_mobile}>
            <TeacherMobile />
          </MobileShell>
        )}
        {(currentRole === 'parent' || currentRole === 'parent_mobile') && (
          <MobileShell activeRoleTitle={roleTitles.parent_mobile}>
            <ParentMobile />
          </MobileShell>
        )}
      </div>

      {/* Global Modals & Overlays */}
      <ThemeCustomizerModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
      />
      <ReceiptModal />
      <QuickSearchModal />
      <ScenarioRunnerModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
