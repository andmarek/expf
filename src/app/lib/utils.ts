export function generatePlainPassword(
  length = 10,
  includeNumbers = true,
  includeSymbols = false,
) {
  const charset = [
    "abcdefghijkmnopqrstuvwxyz", // Avoiding 'l' for clarity
    "ABCDEFGHJKLMNPQRSTUVWXYZ", // Avoiding 'I' and 'O' for clarity
    "23456789", // Avoiding '0' and '1' for clarity
    "!@#$%^&*", // Example symbols, adjust as needed
  ];

  // Determine which character sets to include
  let charactersToUse = charset[0] + charset[1]; // Always include lowercase and uppercase
  if (includeNumbers) charactersToUse += charset[2];
  if (includeSymbols) charactersToUse += charset[3];

  // Generate the password
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersToUse.length);
    password += charactersToUse[randomIndex];
  }

  return password;
}
