"use client";

import MasterSkillsList from '@/components/hr/MasterSkillsList';
import RoleSkillRequirements from '@/components/hr/RoleSkillRequirements';

const SkillsRolesManagementPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Skills & Roles Management</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Master Skills List</h2>
          <MasterSkillsList />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Role Skill Requirements</h2>
          <RoleSkillRequirements />
        </div>
      </div>
    </div>
  );
};

export default SkillsRolesManagementPage;