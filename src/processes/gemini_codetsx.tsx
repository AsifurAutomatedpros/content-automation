"use client";
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Output from '@/components/output';

interface ProcessResponse {
  message: string;
  data: any;
}

interface ProcessProps {
  inputText: string;
}

export const processData = async (
  inputLines: string[]
): Promise<any> => {
  try {
    const inputText = inputLines.join("\n");
    // Prepare the prompt
    const generatedPrompt = "take file from atatchment \n\nFollow these instructions strictly:\nValidation: error free code needed in html using taliwind no compoents \n\nProfile.tsx:\n\"use client\"\n\nimport React, { useState, useEffect, useRef } from \"react\"\nimport { cn } from \"@/lib/utils\"\nimport { Avatar } from \"./ui/avatar\"\nimport Icon from \"./icon/Icon\"\nimport { typography } from \"@/app/styles/typography\"\nimport SimpleButton from \"./ui/simple-button\"\nimport { IconicButton } from \"./IconicButton\"\nimport { EditNameModal } from \"./EditNameModal\"\nimport { ChangePasswordModal } from \"./ChangePasswordModal\"\nimport { VerifyPhoneNumberModal } from \"./VerifyPhoneNumberModal\"\nimport { useRouter } from \"next/navigation\"\n\nimport { Modal } from \"./ui/modal\"\nimport { Button } from \"./ui/button\"\nimport { PhoneNumberInput } from \"./PhoneNumberInput\"\nimport { countries } from \'./ui/CountryList\'\n\nexport interface ProfileProps {\n  /**\n   * User\'s full name\n   */\n  name: string\n  \n  /**\n   * User\'s email address\n   */\n  email: string\n  \n  /**\n   * User\'s phone number\n   */\n  phone: string\n  \n  /**\n   * User\'s profile image URL\n   */\n  profileImage?: string\n  \n  /**\n   * Whether to show the edit button on the avatar\n   * @default true\n   */\n  showAvatarEdit?: boolean\n  \n  /**\n   * User\'s password (masked)\n   */\n  password: string\n  \n  /**\n   * Last login time\n   */\n  lastLogin?: string\n  \n  /**\n   * Whether the Profile panel is visible\n   * @default false\n   */\n  isOpen?: boolean\n  \n  /**\n   * Callback when the user clicks the close button\n   */\n  onClose?: () => void\n  \n  /**\n   * Callback when the user clicks to edit their avatar\n   */\n  onAvatarEdit?: (file?: File) => void\n  \n  /**\n   * Callback when the user clicks to edit their profile\n   */\n  onEdit?: (newName: string) => void\n  \n  /**\n   * Callback when the user clicks to change their password\n   */\n  onChangePassword?: (data: {\n    currentPassword: string;\n    newPassword: string;\n    confirmPassword: string;\n  }) => void\n  \n  /**\n   * Callback when the user clicks to go to billing\n   */\n  onGoToBilling?: () => void\n  \n  /**\n   * Callback when the user clicks to upgrade their plan\n   */\n  onUpgrade?: () => void\n  \n  /**\n   * Callback when the user clicks to go to service provider settings\n   */\n  onGoToSP?: () => void\n  \n  /**\n   * Callback when the user clicks to go to payment settings\n   */\n  onGoToPayment?: () => void\n  \n  /**\n   * Callback when the user clicks to refresh cache\n   */\n  onRefreshCache?: () => void\n  \n  /**\n   * Callback when the user clicks to log out\n   */\n  onLogout?: () => void\n  \n  /**\n   * Callback when the user changes their phone number\n   */\n  onChangePhone?: (phoneNumber: string, countryCode: string) => void\n  \n  /**\n   * Optional class name for additional styling\n   */\n  className?: string\n}\n\n/**\n * Profile component that displays user information and account options\n */\nexport function Profile({\n  name,\n  email,\n  phone,\n  profileImage,\n  showAvatarEdit = true,\n  password,\n  lastLogin,\n  isOpen = false,\n  onClose,\n  onAvatarEdit,\n  onEdit,\n  onChangePassword,\n  onRefreshCache,\n  onLogout,\n  onChangePhone,\n  className\n}: ProfileProps) {\n  const router = useRouter();\n  const [isEditNameModalOpen, setIsEditNameModalOpen] = useState(false);\n  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);\n  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);\n  const [isVerifyPhoneModalOpen, setIsVerifyPhoneModalOpen] = useState(false);\n  const [phoneNumber, setPhoneNumber] = useState(phone || \'\');\n  const [countryCode, setCountryCode] = useState(\'GB\');\n  const [dialCode, setDialCode] = useState(\'+44\'); // Default dial code for GB\n\n  if (!isOpen) return null\n  \n  const handleFeedbackClick = () => {\n    router.push(`/suggestion-list`);\n    onClose?.();\n  };\n\n  const handlePhoneChange = (value: string, code: string, dialCodeValue?: string) => {\n    setPhoneNumber(value);\n    setCountryCode(code);\n    if (dialCodeValue) {\n      setDialCode(dialCodeValue);\n    } else {\n      // Find the dial code for the country code\n      const country = countries.find(c => c.code === code);\n      if (country) {\n        setDialCode(country.dialCode);\n      }\n    }\n  };\n\n  const handlePhoneNext = () => {\n    setIsPhoneModalOpen(false);\n    setIsVerifyPhoneModalOpen(true);\n  };\n\n  const handleVerifyComplete = (_code: string) => {\n    // After successful verification\n    onChangePhone?.(phoneNumber, countryCode);\n    setIsVerifyPhoneModalOpen(false);\n  };\n\n  const handleResendCode = () => {\n    // Handle resend verification code\n    console.log(\"Resending verification code...\");\n  };\n\n  return (\n    <>\n      <div \n        className={cn(\n          \"fixed inset-y-0 right-0 z-50 w-[354px] bg-white dark:bg-[#111] shadow-lg overflow-y-auto border-l border-black-10 dark:border-white-60\",\n          className\n        )}\n      >\n        {/* Close button */}\n        <div className=\"absolute z-50 right-4 top-4\">\n          <IconicButton\n            buttonType=\"white-shadow\"\n            size=\"large\"\n            icon=\"close\"\n            onClick={onClose}\n            className=\"cursor-pointer\"\n          />\n        </div>\n        \n        <div className=\"flex flex-col gap-0 min-h-full\">\n\n          <div className=\"p-xl flex flex-col gap-l\">\n            {/* Avatar and user info */}\n            <div className=\"flex flex-col items-center gap-3\">\n              <Avatar \n                size=\"large\"\n                imageSrc={profileImage}\n                showEditButton={showAvatarEdit}\n                onEditClick={onAvatarEdit}\n              />\n            </div>\n\n            {/* Name */}  \n            <div className=\"flex items-center justify-between\">\n              <div>\n                <p className={cn(\n                  typography.CaptionNormal,\n                  \"text-text-black-60 mb-1\"\n                )}>Name</p>\n                <p className={cn(typography.BodyNormal, \"text-text-black font-medium\")}>{name}</p>\n              </div>\n              \n              <SimpleButton size=\"small\" onClick={() => setIsEditNameModalOpen(true)}>\n                Edit\n              </SimpleButton>\n            </div>\n              \n            {/* Email */}\n            <div>\n              <p className={cn(\n                typography.CaptionNormal,\n                \"text-text-black-60 mb-1\"\n              )}>Email</p>\n              <p className={cn(typography.BodyNormal, \"text-text-black font-medium\")}>{email}</p>\n            </div>\n            \n            {/* Phone */}\n            <div className=\"flex items-center justify-between\">\n              <div>\n                <p className={cn(\n                  typography.CaptionNormal,\n                  \"text-text-black-60 mb-1\"\n                )}>Phone</p>\n                <p className={cn(typography.BodyNormal, \"text-text-black font-medium\")}>{phone}</p>\n              </div>\n              \n              <SimpleButton size=\"small\" onClick={() => setIsPhoneModalOpen(true)}>\n                Change\n              </SimpleButton>\n            </div>\n              \n            {/* Password */}\n            <div className=\"flex items-center justify-between\">\n              <div>\n                <p className={cn(\n                  typography.CaptionNormal,\n                  \"text-text-black-60 mb-1\"\n                )}>Password</p>\n                <p className={cn(typography.BodyNormal, \"text-text-black font-medium\")}>{password}</p>\n              </div>\n              \n              <SimpleButton size=\"small\" onClick={() => setIsChangePasswordModalOpen(true)}>\n                Change\n              </SimpleButton>\n            </div>\n\n          </div>\n          \n          {/* Action buttons */}\n          <div className=\"sticky bottom-0 bg-white dark:bg-[#111] flex flex-col gap-l p-xl border-t border-black-10 dark:border-white-60\">\n            <button \n              className=\"flex items-center gap-2 cursor-pointer group\"\n              onClick={handleFeedbackClick}\n              aria-label=\"Open suggestion box\"\n            >\n              <span className=\"group-hover:text-brand-orange transition-colors\">\n                <Icon \n                  name=\"feedback-20\" \n                  size={20} \n                  color=\"currentColor\" \n                />\n              </span>\n              <span className={cn(typography.BodyNormal, \"text-text-black group-hover:text-brand-orange transition-colors\")}>Suggestion Box</span>\n            </button>\n            \n            <button \n              className=\"flex items-center gap-2 cursor-pointer group\"\n              onClick={onRefreshCache}\n              aria-label=\"Refresh cache\"\n            >\n              <span className=\"group-hover:text-brand-orange transition-colors\">\n                <Icon \n                  name=\"cached-20\" \n                  size={20} \n                  color=\"currentColor\" \n                />\n              </span>\n              <span className={cn(typography.BodyNormal, \"text-text-black group-hover:text-brand-orange transition-colors\")}>Refresh Cache</span>\n            </button>\n            \n            <button \n              className=\"flex items-center gap-2 cursor-pointer group\"\n              onClick={() => {\n                onLogout?.();\n                router.push(\'/login\');\n              }}\n              aria-label=\"Log out\"\n            >\n              <span className=\"group-hover:text-brand-orange transition-colors\">\n                <Icon \n                  name=\"logout\" \n                  size={20} \n                  color=\"currentColor\" \n                />\n              </span>\n              <span className={cn(typography.BodyNormal, \"text-text-black group-hover:text-brand-orange transition-colors\")}>Log out</span>\n            </button>\n            \n            {lastLogin && (\n              <div className=\"flex items-center gap-2 text-gray-500 text-sm\">\n                <Icon name=\"warning-20\" size={20} color=\"rgba(0, 0, 0, 0.5)\" />\n                <span className={cn(typography.BodyNormal, \"text-text-black-60\")}>Last Login was {lastLogin}</span>\n              </div>\n            )}\n          </div>\n        </div>\n      </div>\n\n      {/* Modals */}\n      <EditNameModal\n        isOpen={isEditNameModalOpen}\n        onClose={() => setIsEditNameModalOpen(false)}\n        currentName={name}\n        onSave={onEdit || (() => {})}\n      />\n\n      <ChangePasswordModal\n        isOpen={isChangePasswordModalOpen}\n        onClose={() => setIsChangePasswordModalOpen(false)}\n        onSave={onChangePassword || (() => {})}\n      />\n\n      {/* Phone Number Input Modal */}\n      <Modal\n        open={isPhoneModalOpen}\n        onClose={() => setIsPhoneModalOpen(false)}\n        title=\"Change Phone Number\"\n        size=\"small\"\n        showFooter={false}\n      >\n        <div className=\"flex flex-col gap-6 pb-4\">\n          <PhoneNumberInput\n            value={phoneNumber}\n            countryCode={countryCode}\n            onChange={handlePhoneChange}\n          />\n\n          <Button\n            variant=\"primary\"\n            className=\"w-full\"\n            onClick={handlePhoneNext}\n            disabled={!phoneNumber || phoneNumber.trim().length < 8}\n          >\n            Next\n          </Button>\n        </div>\n      </Modal>\n\n      {/* Verification Modal */}\n      <VerifyPhoneNumberModal\n        open={isVerifyPhoneModalOpen}\n        phoneNumber={`\${dialCode} \${phoneNumber}`}\n        onClose={() => {\n          setIsVerifyPhoneModalOpen(false);\n          setIsPhoneModalOpen(true); // Go back to phone input if verification is cancelled\n        }}\n        onVerify={handleVerifyComplete}\n        onResend={handleResendCode}\n        onBack={() => {\n          setIsVerifyPhoneModalOpen(false);\n          setIsPhoneModalOpen(true);\n        }}\n      />\n    </>\n  )\n} \n\nInput:{{$inputText}}\n" + inputText;

    // Prepare FormData for file upload
    const formData = new FormData();
    formData.append('prompt', generatedPrompt);

    // Add other payload fields
    formData.append('model', "gemini-1.5-pro");
    formData.append('max_tokens', 200);
    formData.append('temperature', "0.7");

    // Handle file uploads
    
    // Get files from public directory
    const fileField = {"type":"array","sourceType":"input","name":"attachments","source":"1"};
    const files = await Promise.all(
      (await fetch(`/api/process-file/content?processId=${processId}&label=${fileField.name}`).then(res => res.json()))
        .map(async (file: any) => {
          const response = await fetch(`/api/process-file/content?processId=${processId}&label=${fileField.name}&filename=${file.name}`);
          const content = await response.text();
          return new Blob([content], { type: 'text/plain' });
        })
    );
    
    // Add files to FormData
    files.forEach((file, index) => {
      formData.append('attachments', file, `file${index}`);
    });

    // Make API call
    const response = await axios.post(
      'https://dev.felidae.network/api/gemini/code_generation',
      formData,
      { 
        headers: { 
          'Content-Type': 'multipart/form-data'
        }, 
        timeout: 60000 
      }
    );
    // Extract output using responsePath
    const output = response.data.data.code;
    return output;
  } catch (error) {
    console.error('Error processing data:', error);
    throw error;
  }
};

export const Process: React.FC<ProcessProps> = ({ 
  inputText
}) => {
  const [output, setOutput] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processText = async () => {
      if (!inputText) return;
      setLoading(true);
      setError(null);
      try {
        const result = await processData(inputText.split("\n"));
        setOutput(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    processText();
  }, [inputText]);

  if (loading) return <div>Processing...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!output) return null;

  return <Output type={"text"} content={output} />;
};

export default Process;
