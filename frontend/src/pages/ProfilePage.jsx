import { useParams } from "react-router-dom";

import ProfileHeader from "../components/ProfileHeader";
import AboutSection from "../components/AboutSection";
import ExperienceSection from "../components/ExperienceSection";
import EducationSection from "../components/EducationSection";
import SkillsSection from "../components/SkillsSection";
import toast from "react-hot-toast";
import { useAuth } from "../services/useAuth";
import { useUsers } from "../services/useUsers";
import { useState } from "react";

const ProfilePage = () => {
	const [isEditing, setIsEditing] = useState(false)
	const { username } = useParams();

	const {authUser} = useAuth()

    const {userProfile,isUserProfileLoading,updateProfile} = useUsers(username)

	if (isUserProfileLoading) return null;
    console.log(userProfile);
    

	const isOwnProfile = authUser.username === userProfile.data.username;
	const userData = isOwnProfile ? authUser : userProfile.data;

	const handleSave = (updatedData) => {
		updateProfile(updatedData);
	};

	return (
		<div className='max-w-4xl mx-auto p-4'>
			<ProfileHeader userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} isEditing={isEditing} setIsEditing={setIsEditing} />
			<AboutSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} isEditing={isEditing} />
			<ExperienceSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} isEditing={isEditing} />
			<EducationSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} isEditing={isEditing} />
			<SkillsSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} isEditing={isEditing} />
		</div>
	);
};
export default ProfilePage;