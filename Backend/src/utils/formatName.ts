export default function formatName(nameFormat: string, lastNameFormat: string) {
  const name = /[a-zA-Z]/.test(nameFormat.charAt(0))
    ? nameFormat.charAt(0).toUpperCase() + nameFormat.slice(1)
    : nameFormat;
  const lastName = /[a-zA-Z]/.test(lastNameFormat.charAt(0))
    ? lastNameFormat.charAt(0).toUpperCase() + lastNameFormat.slice(1)
    : lastNameFormat;

  return { name, lastName };
}
