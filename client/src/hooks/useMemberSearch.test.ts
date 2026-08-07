// Tester för useMemberSearch — sök och filter för medlemslistan
// Ren presentation-logik utan API, så den är lätt att testa med renderHook

import { describe, it, expect } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useMemberSearch } from "./useMemberSearch"
import type { Member } from "../domain/member"
import { makeMember } from "../test/factories"

const members: Member[] = [
  makeMember({ id: "1", name: "Anna", category: "adult", status: "active" }),
  makeMember({ id: "2", name: "Johan", category: "youth", status: "active" }),
  makeMember({ id: "3", name: "Maria", category: "adult", status: "inactive" }),
]

describe("useMemberSearch", () => {
  it("visar alla medlemmar som standard", () => {
    const { result } = renderHook(() => useMemberSearch(members))
    expect(result.current.filteredMembers).toHaveLength(3)
  })

  it("filtrerar på sök-text (skiftlägesokänsligt)", () => {
    const { result } = renderHook(() => useMemberSearch(members))
    act(() => result.current.setSearchText("anna"))
    expect(result.current.filteredMembers.map((m) => m.name)).toEqual(["Anna"])
  })

  it("filtrerar på kategori", () => {
    const { result } = renderHook(() => useMemberSearch(members))
    act(() => result.current.setFilter("youth"))
    expect(result.current.filteredMembers.map((m) => m.name)).toEqual(["Johan"])
  })

  it("filtrerar på status (inaktiva)", () => {
    const { result } = renderHook(() => useMemberSearch(members))
    act(() => result.current.setStatusFilter("inactive"))
    expect(result.current.filteredMembers.map((m) => m.name)).toEqual(["Maria"])
  })
})
