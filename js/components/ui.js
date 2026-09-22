/* Shared UI helpers are intentionally kept tiny; view-specific rendering lives in views.js. */
function iconPath(name){return `assets/icons/${String(name||'spark.svg').replace(/^.*[\\/]/,'')}`}
function safeText(value,fallback=''){return String(value??fallback)}
