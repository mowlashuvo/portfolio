// GSAP Animations

document.addEventListener("DOMContentLoaded", () => {
  // Page load animation
  gsap.from("header", { duration: 1, y: -50, opacity: 0, ease: "power2.out" });

  // Section reveal on scroll
  const sections = document.querySelectorAll("section");
  sections.forEach((section) => {
    gsap.from(section, {
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
      },
      duration: 1,
      y: 50,
      opacity: 0,
      ease: "power2.out",
    });
  });

  // Button hover effect
  const buttons = document.querySelectorAll("button, .btn");
  buttons.forEach((button) => {
    button.addEventListener("mouseenter", () => {
      gsap.to(button, { scale: 1.1, duration: 0.2 });
    });
    button.addEventListener("mouseleave", () => {
      gsap.to(button, { scale: 1, duration: 0.2 });
    });
  });
});