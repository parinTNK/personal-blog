import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import { useUser } from "@/context/UserContext";
import { FaRegUser } from "react-icons/fa";
import { RiResetLeftLine } from "react-icons/ri";
import ProfileEdit from "@/components/ui/ProfileEdit";
import ResetPassword from "@/components/ui/ResetPassword";

function MemberManagement() {
    const { currentUser } = useUser();
    const location = useLocation();

    const getInitialTab = () => {
        return location.state?.defaultTab || 'profile';
    };
    const [activeTab, setActiveTab] = useState(getInitialTab);

    const renderProfilePicture = () => {
        if (currentUser?.profile_pic) {
            return (
                <img
                    src={currentUser.profile_pic}
                    alt={`${currentUser.username || 'User'}'s profile picture`}
                    className="w-full h-full object-cover"
                />
            );
        }
        return (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Pic
            </div>
        );
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileEdit />;
            case 'password':
                return <ResetPassword />;
            default:
                return null;
        }
    };

    const TabItem = ({ label, icon: Icon, tabKey }) => (
        <button
            type="button"
            onClick={() => {
                setActiveTab(tabKey);
            }}
            className={`inline-flex items-center gap-3 md:gap-4 text-base md:text-lg cursor-pointer transition-colors duration-150 w-full text-left p-0 bg-transparent border-none ${activeTab === tabKey ? 'font-semibold text-black' : 'text-gray-500 hover:text-gray-800'
                }`}
        >
            {Icon && <Icon className="flex-shrink-0" />}
            <span>{label}</span>
        </button>
    );

    const getCurrentTabLabel = () => {
        if (activeTab === 'password') return 'Reset Password';
        return 'Profile';
    };

    return (
        <>
            <Navbar />
            <div className="container mx-auto mt-10 px-4 md:px-8 lg:px-70">
                <div className="flex flex-row items-center gap-5 md:pb-20 pb-10">
                    <div className="w-10 h-10 md:w-20 md:h-20 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                        {renderProfilePicture()}
                    </div>
                    <h1 className="text-xl md:text-2xl text-gray-500 font-semibold">
                        {currentUser?.username}
                        <span className="mx-5">|</span>
                        <span className="text-black">{getCurrentTabLabel()}</span>
                    </h1>
                </div>

                <div className="flex flex-col md:flex-row gap-8 md:gap-12 mb-10">
                    <div className="w-full md:w-1/4 flex flex-row md:flex-col gap-4 md:gap-5 border-b md:border-b-0 md:border-r md:pr-8 pb-4 md:pb-0 border-gray-200">
                        <TabItem label="Profile" icon={FaRegUser} tabKey="profile" />
                        <TabItem label="Reset Password" icon={RiResetLeftLine} tabKey="password" />
                    </div>

                    <div className="w-full md:w-3/4">
                        {renderTabContent()}
                    </div>
                </div>
            </div>
        </>
    );
}

export default MemberManagement;
