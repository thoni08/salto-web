export function showToast(message, { type = "info", duration = 3000 } = {}) {
  const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
  const containerId = "__app_toast_container";

  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement("div");
    container.id = containerId;
    container.style.position = "fixed";
    container.style.right = "16px";
    container.style.top = "16px";
    container.style.zIndex = 99999;
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "8px";
    document.body.appendChild(container);
  }

  const el = document.createElement("div");
  el.id = id;
  el.textContent = message;
  el.style.minWidth = "200px";
  el.style.padding = "10px 14px";
  el.style.borderRadius = "10px";
  el.style.color = "white";
  el.style.boxShadow = "0 6px 18px rgba(2,6,23,0.2)";
  el.style.fontSize = "14px";
  el.style.opacity = "0";
  el.style.transition = "opacity 160ms ease, transform 200ms ease";

  if (type === "success") {
    el.style.background = "#16a34a";
  } else if (type === "error") {
    el.style.background = "#dc2626";
  } else if (type === "warning") {
    el.style.background = "#fb923c";
  } else {
    el.style.background = "#111827";
  }

  container.appendChild(el);

  // trigger enter
  requestAnimationFrame(() => {
    el.style.opacity = "1";
    el.style.transform = "translateY(0)";
  });

  const remove = () => {
    el.style.opacity = "0";
    setTimeout(() => {
      if (el && el.parentNode) el.parentNode.removeChild(el);
    }, 220);
  };

  const timer = setTimeout(remove, duration);
  el.addEventListener("click", () => {
    clearTimeout(timer);
    remove();
  });

  return id;
}
