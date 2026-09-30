import "@testing-library/jest-dom";

if (typeof URL !== "undefined" && typeof URL.createObjectURL !== "function") {
  URL.createObjectURL = jest.fn(() => "blob:mock-url");
}
if (typeof URL !== "undefined" && typeof URL.revokeObjectURL !== "function") {
  URL.revokeObjectURL = jest.fn();
}

if (
  typeof window !== "undefined" &&
  typeof window.webkitURL !== "undefined" &&
  typeof window.webkitURL.createObjectURL !== "function"
) {
  window.webkitURL.createObjectURL = jest.fn(() => "blob:mock-url");
}
if (
  typeof window !== "undefined" &&
  typeof window.webkitURL !== "undefined" &&
  typeof window.webkitURL.revokeObjectURL !== "function"
) {
  window.webkitURL.revokeObjectURL = jest.fn();
}
