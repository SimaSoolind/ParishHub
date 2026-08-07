// hookHelpers — gemensamma hjälpare för hook-tester (DRY)
// Samlar upprepade setup-steg så testerna blir korta och lätta att läsa
//
// Används av: alla hook-tester som hämtar data async via ett repository

import { waitFor } from "@testing-library/react"
import { expect } from "vitest"

// Väntar tills en hook är klar med sin första hämtning (loading = false)
// Tar renderHook-resultatet (result) för en hook som har ett loading-fält
// Returnerar inget — används i stället för att upprepa waitFor i varje test
export async function waitForLoaded<T extends { loading: boolean }>(result: {
  current: T
}): Promise<void> {
  await waitFor(() => expect(result.current.loading).toBe(false))
}
