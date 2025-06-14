"use client"

import React, { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { Avatar } from "./ui/avatar"
import Icon from "./icon/Icon"
import { typography } from "@/app/styles/typography"
import SimpleButton from "./ui/simple-button"
import { IconicButton } from "./IconicButton"
import { EditNameModal } from "./EditNameModal"
import { ChangePasswordModal } from "./ChangePasswordModal"
import { VerifyPhoneNumberModal } from "./VerifyPhoneNumberModal"
import { useRouter } from "next/navigation"

import { Modal } from "./ui/modal"
import { Button } from "./ui/button"
import { PhoneNumberInput } from "./PhoneNumberInput"
import { countries } from './ui/CountryList'

export interface ProfileProps {
  /**
   * User's full name
   */
  name: string
  
  /**
   * User's email address
   */
  email: string
  
  /**
   * User's phone number
   */
  phone: string
  
  /**
   * User's profile image URL
   */
  profileImage?: string
  
  /**
   * Whether to show the edit button on the avatar
   * @default true
   */
  showAvatarEdit?: boolean
  
  /**
   * User's password (masked)
   */
  password: string
  
  /**
   * Last login time
   */
  lastLogin?: string
  
  /**
   * Whether the Profile panel is visible
   * @default false
   */
  isOpen?: boolean
  
  /**
   * Callback when the user clicks the close button
   */
  onClose?: () => void
  
  /**
   * Callback when the user clicks to edit their avatar
   */
  onAvatarEdit?: (file?: File) => void
  
  /**
   * Callback when the user clicks to edit their profile
   */
  onEdit?: (newName: string) => void
  
  /**
   * Callback when the user clicks to change their password
   */
  onChangePassword?: (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => void
  
  /**
   * Callback when the user clicks to go to billing
   */
  onGoToBilling?: () => void
  
  /**
   * Callback when the user clicks to upgrade their plan
   */
  onUpgrade?: () => void
  
  /**
   * Callback when the user clicks to go to service provider settings
   */
  onGoToSP?: () => void
  
  /**
   * Callback when the user clicks to go to payment settings
   */
  onGoToPayment?: () => void
  
  /**
   * Callback when the user clicks to refresh cache
   */
  onRefreshCache?: () => void
  
  /**
   * Callback when the user clicks to log out
   */
  onLogout?: () => void
  
  /**
   * Callback when the user changes their phone number
   */
  onChangePhone?: (phoneNumber: string, countryCode: string) => void
  
  /**
   * Optional class name for additional styling
   */
  className?: string
}

/**
 * Profile component that displays user information and account options
 */
export function Profile({
  name,
  email,
  phone,
  profileImage,
  showAvatarEdit = true,
  password,
  lastLogin,
  isOpen = false,
  onClose,
  onAvatarEdit,
  onEdit,
  onChangePassword,
  onRefreshCache,
  onLogout,
  onChangePhone,
  className
}: ProfileProps) {
  const router = useRouter();
  const [isEditNameModalOpen, setIsEditNameModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isVerifyPhoneModalOpen, setIsVerifyPhoneModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(phone || '');
  const [countryCode, setCountryCode] = useState('GB');
  const [dialCode, setDialCode] = useState('+44'); // Default dial code for GB

  if (!isOpen) return null
  
  const handleFeedbackClick = () => {
    router.push(`/suggestion-list`);
    onClose?.();
  };

  const handlePhoneChange = (value: string, code: string, dialCodeValue?: string) => {
    setPhoneNumber(value);
    setCountryCode(code);
    if (dialCodeValue) {
      setDialCode(dialCodeValue);
    } else {
      // Find the dial code for the country code
      const country = countries.find(c => c.code === code);
      if (country) {
        setDialCode(country.dialCode);
      }
    }
  };

  const handlePhoneNext = () => {
    setIsPhoneModalOpen(false);
    setIsVerifyPhoneModalOpen(true);
  };

  const handleVerifyComplete = (_code: string) => {
    // After successful verification
    onChangePhone?.(phoneNumber, countryCode);
    setIsVerifyPhoneModalOpen(false);
  };

  const handleResendCode = () => {
    // Handle resend verification code
    console.log("Resending verification code...");
  };

  return (
    <>
      <div 
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-[354px] bg-white dark:bg-[#111] shadow-lg overflow-y-auto border-l border-black-10 dark:border-white-60",
          className
        )}
      >
        {/* Close button */}
        <div className="absolute z-50 right-4 top-4">
          <IconicButton
            buttonType="white-shadow"
            size="large"
            icon="close"
            onClick={onClose}
            className="cursor-pointer"
          />
        </div>
        
        <div className="flex flex-col gap-0 min-h-full">

          <div className="p-xl flex flex-col gap-l">
            {/* Avatar and user info */}
            <div className="flex flex-col items-center gap-3">
              <Avatar 
                size="large"
                imageSrc={profileImage}
                showEditButton={showAvatarEdit}
                onEditClick={onAvatarEdit}
              />
            </div>

            {/* Name */}  
            <div className="flex items-center justify-between">
              <div>
                <p className={cn(
                  typography.CaptionNormal,
                  "text-text-black-60 mb-1"
                )}>Name</p>
                <p className={cn(typography.BodyNormal, "text-text-black font-medium")}>{name}</p>
              </div>
              
              <SimpleButton size="small" onClick={() => setIsEditNameModalOpen(true)}>
                Edit
              </SimpleButton>
            </div>
              
            {/* Email */}
            <div>
              <p className={cn(
                typography.CaptionNormal,
                "text-text-black-60 mb-1"
              )}>Email</p>
              <p className={cn(typography.BodyNormal, "text-text-black font-medium")}>{email}</p>
            </div>
            
            {/* Phone */}
            <div className="flex items-center justify-between">
              <div>
                <p className={cn(
                  typography.CaptionNormal,
                  "text-text-black-60 mb-1"
                )}>Phone</p>
                <p className={cn(typography.BodyNormal, "text-text-black font-medium")}>{phone}</p>
              </div>
              
              <SimpleButton size="small" onClick={() => setIsPhoneModalOpen(true)}>
                Change
              </SimpleButton>
            </div>
              
            {/* Password */}
            <div className="flex items-center justify-between">
              <div>
                <p className={cn(
                  typography.CaptionNormal,
                  "text-text-black-60 mb-1"
                )}>Password</p>
                <p className={cn(typography.BodyNormal, "text-text-black font-medium")}>{password}</p>
              </div>
              
              <SimpleButton size="small" onClick={() => setIsChangePasswordModalOpen(true)}>
                Change
              </SimpleButton>
            </div>

          </div>
          
          {/* Action buttons */}
          <div className="sticky bottom-0 bg-white dark:bg-[#111] flex flex-col gap-l p-xl border-t border-black-10 dark:border-white-60">
            <button 
              className="flex items-center gap-2 cursor-pointer group"
              onClick={handleFeedbackClick}
              aria-label="Open suggestion box"
            >
              <span className="group-hover:text-brand-orange transition-colors">
                <Icon 
                  name="feedback-20" 
                  size={20} 
                  color="currentColor" 
                />
              </span>
              <span className={cn(typography.BodyNormal, "text-text-black group-hover:text-brand-orange transition-colors")}>Suggestion Box</span>
            </button>
            
            <button 
              className="flex items-center gap-2 cursor-pointer group"
              onClick={onRefreshCache}
              aria-label="Refresh cache"
            >
              <span className="group-hover:text-brand-orange transition-colors">
                <Icon 
                  name="cached-20" 
                  size={20} 
                  color="currentColor" 
                />
              </span>
              <span className={cn(typography.BodyNormal, "text-text-black group-hover:text-brand-orange transition-colors")}>Refresh Cache</span>
            </button>
            
            <button 
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => {
                onLogout?.();
                router.push('/login');
              }}
              aria-label="Log out"
            >
              <span className="group-hover:text-brand-orange transition-colors">
                <Icon 
                  name="logout" 
                  size={20} 
                  color="currentColor" 
                />
              </span>
              <span className={cn(typography.BodyNormal, "text-text-black group-hover:text-brand-orange transition-colors")}>Log out</span>
            </button>
            
            {lastLogin && (
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Icon name="warning-20" size={20} color="rgba(0, 0, 0, 0.5)" />
                <span className={cn(typography.BodyNormal, "text-text-black-60")}>Last Login was {lastLogin}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditNameModal
        isOpen={isEditNameModalOpen}
        onClose={() => setIsEditNameModalOpen(false)}
        currentName={name}
        onSave={onEdit || (() => {})}
      />

      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        onSave={onChangePassword || (() => {})}
      />

      {/* Phone Number Input Modal */}
      <Modal
        open={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
        title="Change Phone Number"
        size="small"
        showFooter={false}
      >
        <div className="flex flex-col gap-6 pb-4">
          <PhoneNumberInput
            value={phoneNumber}
            countryCode={countryCode}
            onChange={handlePhoneChange}
          />

          <Button
            variant="primary"
            className="w-full"
            onClick={handlePhoneNext}
            disabled={!phoneNumber || phoneNumber.trim().length < 8}
          >
            Next
          </Button>
        </div>
      </Modal>

      {/* Verification Modal */}
      <VerifyPhoneNumberModal
        open={isVerifyPhoneModalOpen}
        phoneNumber={`${dialCode} ${phoneNumber}`}
        onClose={() => {
          setIsVerifyPhoneModalOpen(false);
          setIsPhoneModalOpen(true); // Go back to phone input if verification is cancelled
        }}
        onVerify={handleVerifyComplete}
        onResend={handleResendCode}
        onBack={() => {
          setIsVerifyPhoneModalOpen(false);
          setIsPhoneModalOpen(true);
        }}
      />
    </>
  )
} 