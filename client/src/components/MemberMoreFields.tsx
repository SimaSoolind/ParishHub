// MemberMoreFields — de valfria fälten i medlemsformuläret (visas när man expanderar)
// Bryts ut ur AddMemberModal så modalen hålls kort. Använder de återanvändbara
// fält-komponenterna (FormField, FormDropdown, PhotoPicker)
//
// Används av: AddMemberModal

import { useTranslation } from "react-i18next"
import type { MemberCategory, MemberLanguage, MemberStatus, FamilyRole } from "../domain/member"
import { FormField } from "./FormField"
import { FormDropdown } from "./FormDropdown"
import { PhotoPicker } from "./PhotoPicker"

// Alla värden i medlemsformuläret (familySize hålls som text — input ger alltid text)
// Delas med AddMemberModal så state kan hållas i ett objekt
export interface MemberFormValues {
  name: string
  phone: string
  email: string
  address: string
  familySize: string
  birthday: string
  category: MemberCategory
  notes: string
  photoUrl: string
  preferredName: string
  language: MemberLanguage
  status: MemberStatus
  familyRole: FamilyRole | ""
}

// Alternativ i dropdown-fälten — texten översätts via i18n
const categoryOptions: MemberCategory[] = ["adult", "youth", "leader", "other"]
const languageOptions: MemberLanguage[] = ["sv", "ar", "en", "el", "ru", "syr"]
const statusOptions: MemberStatus[] = ["active", "inactive"]
const familyRoleOptions: (FamilyRole | "")[] = ["", "spouse", "child", "parent", "sibling"]

interface Props {
  values: MemberFormValues
  errors: Record<string, string>
  setField: <K extends keyof MemberFormValues>(key: K, value: MemberFormValues[K]) => void
  onPhotoChange: (dataUrl: string) => void
  onPhotoClear: () => void
  onPhotoError: (message: string) => void
}

// Ritar de valfria fälten (namn/telefon ligger kvar i modalen)
// Tar emot values, errors, setField och foto-callbacks
// Returnerar fälten som JSX
export function MemberMoreFields({
  values,
  errors,
  setField,
  onPhotoChange,
  onPhotoClear,
  onPhotoError,
}: Props) {
  const { t } = useTranslation()

  return (
    <>
      <FormField
        className="mb-4"
        label={t("form.preferredName")}
        value={values.preferredName}
        onChange={(value) => setField("preferredName", value)}
        placeholder={t("form.phPreferredName")}
        maxLength={100}
      />

      <FormField
        className="mb-4"
        label={t("form.email")}
        value={values.email}
        onChange={(value) => setField("email", value)}
        error={errors["email"]}
        type="email"
        inputMode="email"
        placeholder={t("form.phEmail")}
      />

      <FormField
        className="mb-4"
        label={t("form.address")}
        value={values.address}
        onChange={(value) => setField("address", value)}
        error={errors["address"]}
        placeholder={t("form.phAddress")}
      />

      {/* Familjestorlek och födelsedag bredvid varandra */}
      <div className="flex gap-3 mb-4">
        <FormField
          className="flex-1"
          label={t("form.familySize")}
          value={values.familySize}
          onChange={(value) => setField("familySize", value)}
          error={errors["familySize"]}
          type="number"
          inputMode="numeric"
          min={1}
        />
        <FormField
          className="flex-1"
          label={t("form.birthday")}
          value={values.birthday}
          onChange={(value) => setField("birthday", value)}
          error={errors["birthday"]}
          placeholder={t("form.phBirthday")}
        />
      </div>

      <FormDropdown
        className="mb-4"
        label={t("form.category")}
        value={values.category}
        onChange={(value) => setField("category", value as MemberCategory)}
        options={categoryOptions.map((value) => ({ value, label: t("members.filter." + value) }))}
      />

      {/* Språk + status bredvid varandra */}
      <div className="flex gap-3 mb-4">
        <FormDropdown
          className="flex-1"
          label={t("form.language")}
          value={values.language}
          onChange={(value) => setField("language", value as MemberLanguage)}
          options={languageOptions.map((value) => ({ value, label: t("form.lang." + value) }))}
        />
        <FormDropdown
          className="flex-1"
          label={t("form.status")}
          value={values.status}
          onChange={(value) => setField("status", value as MemberStatus)}
          options={statusOptions.map((value) => ({
            value,
            label: t("form.memberStatus." + value),
          }))}
        />
      </div>

      <FormDropdown
        className="mb-4"
        label={t("form.familyRole")}
        value={values.familyRole}
        onChange={(value) => setField("familyRole", value as FamilyRole | "")}
        options={familyRoleOptions.map((value) => ({
          value,
          label: value === "" ? t("form.roleNone") : t("familyRole." + value),
        }))}
      />

      <PhotoPicker
        name={values.name}
        photoUrl={values.photoUrl}
        onChange={onPhotoChange}
        onClear={onPhotoClear}
        onError={onPhotoError}
        error={errors["photoUrl"]}
      />

      {/* Anteckningar — valfritt fält */}
      <div className="mb-6">
        <label className="field-label">{t("form.notesOptional")}</label>
        <textarea
          value={values.notes}
          onChange={(event) => setField("notes", event.target.value)}
          placeholder={t("form.phNotes")}
          rows={2}
          className="field resize-none"
        />
      </div>
    </>
  )
}
