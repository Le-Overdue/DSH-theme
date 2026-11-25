window.__ModuleLoader__.load({
  id: 'dsh-overdue-theme',
  factory() {
    const PACKAGE_ID = 'dsh-overdue-theme';

    /**
     * Micro-interaction for icon glyphs inside controls: a small scale-up reads
     * as "slightly bolder and a touch larger" at 14-18px without recolouring
     * anything, so it composes with every palette and with the host's own hover
     * styles. Transform-only and reduced-motion aware.
     */
    const ICON_HOVER_CSS = `
button svg, a[href] svg, [role='button'] svg, [role='menuitem'] svg,
[role='tab'] svg, [role='option'] svg, [role='treeitem'] svg {
  transition: scale 120ms ease-out;
  transform-origin: center;
}
button:hover svg, a[href]:hover svg, [role='button']:hover svg,
[role='menuitem']:hover svg, [role='tab']:hover svg, [role='option']:hover svg,
[role='treeitem']:hover svg,
button:focus-visible svg, a[href]:focus-visible svg, [role='button']:focus-visible svg {
  scale: 1.08;
}
@media (prefers-reduced-motion: reduce) {
  button svg, a[href] svg, [role='button'] svg, [role='menuitem'] svg,
  [role='tab'] svg, [role='option'] svg, [role='treeitem'] svg { transition: none; }
}
`;

    /**
     * Overdue palette applied as one theme token layer.
     *
     * Every row is [token, light, dark]. The theme service applies the matching
     * column for the active color scheme, so the layer follows the
     * Light/Dark/System appearance preference instead of adding a second theme
     * picker.
     *
     * Neutral surfaces use the "去绿中性" family the user picked: every grey
     * keeps R >= G > B (about -2/-6 from the max channel in dark, -4/-10 in
     * light), so nothing reads green the way the original #20211f / #fbf7ed did
     * (those had G as the highest channel). Lightness anchors:
     *   light  base #f7f3ec  sidebar #f1ece3  card #fdfbf6  border #c6bca8
     *   dark   base #302e2a  sidebar #2a2824  card #35332e  border 22% warm white
     *
     * Colour roles, kept split so no text ends up on a wash:
     *   accent  #9a82c8 / #e69a63 – washes, borders, charts, indicators only.
     *   text    #7a5fb0 / #e69a63 – any token that renders as text.
     *   CTA     ink #242426 (light) and #e69a63 with dark ink label (dark).
     * `--dsw-alias-button-info-fill` is both the send-button fill and a text
     * colour in two pickers, so it sits one step deeper than the accent.
     *
     * Basis: Overdue tokens, with the requested lighter purple and orange
     * (#8468bb → #8f74c4/#9a82c8, #d78345 → #e69a63).
     */
    const palette = [
      // ── Surfaces ───────────────────────────────────────────────────────────
      ['--dsw-alias-bg-base', '#f7f3ec', '#302e2a'],
      ['--dsw-alias-bg-document-preview', '#f1ece3', '#262420'],
      ['--dsw-alias-bg-document-selection', 'rgb(132 104 187 / 30%)', 'rgb(230 154 99 / 28%)'],
      ['--dsw-alias-label-document-preview', '#5d5a52', '#cac7bf'],
      ['--dsw-alias-bg-layer-1', '#fdfbf6', '#363430'],
      ['--dsw-alias-bg-layer-2', '#f2ede4', '#3e3b36'],
      ['--dsw-alias-bg-layer-3', '#eae5dc', '#45423c'],
      ['--dsw-alias-bg-mask-1', 'rgb(36 36 38 / 24%)', 'rgb(0 0 0 / 50%)'],
      ['--dsw-alias-bg-mask-2', 'rgb(36 36 38 / 12%)', 'rgb(0 0 0 / 20%)'],
      ['--dsw-alias-bg-mask-3', 'rgb(0 0 0 / 48%)', 'rgb(0 0 0 / 48%)'],
      ['--dsw-alias-bg-mask-photo', 'rgb(0 0 0 / 88%)', 'rgb(0 0 0 / 88%)'],
      ['--dsw-alias-bg-mask-drop', 'rgb(253 251 246 / 70%)', 'rgb(41 39 35 / 70%)'],
      ['--dsw-alias-bg-module-platform', '#f2ede4', '#2c2a26'],
      ['--dsw-alias-bg-multi-select', '#f2ede4', '#2c2a26'],
      ['--dsw-alias-bg-overlay', '#fdfbf6', '#403d38'],
      ['--dsw-alias-bg-skeleton', 'rgb(36 36 38 / 5%)', 'rgb(238 233 226 / 8%)'],
      ['--dsw-alias-card-fill', '#fdfbf6', '#35332e'],
      ['--dsw-alias-card-fill-hover', '#f3eee5', '#3b3833'],
      ['--dsw-alias-card-tile-fill', 'rgb(253 251 246 / 60%)', 'rgb(238 233 226 / 5%)'],
      ['--dsw-specific-input-major', '#fdfbf6', '#363430'],
      ['--dsw-specific-login-input', '#f2ede4', '#2a2824'],
      ['--dsw-specific-selector', '#f1ece3', '#3e3b36'],
      ['--dsw-specific-tip', '#f1ece3', '#2c2a26'],
      ['--dsw-specific-guide-hero', '#e4ded4', '#45423c'],
      ['--dsw-specific-bubble', '#e9e1d1', '#413d37'],
      ['--dsw-specific-bubble-highlight', '#dfd6c2', '#4d4842'],
      ['--dsw-specific-file-upload-track', 'rgb(36 36 38 / 8%)', 'rgb(238 233 226 / 10%)'],
      ['--dsw-menu-surface-fill', 'rgb(253 251 246 / 72%)', 'rgb(76 73 68 / 90%)'],
      ['--dsw-alias-menu-group-header-fill', 'rgb(250 247 241 / 94%)', 'rgb(74 71 66 / 96%)'],
      ['--dsw-specific-menu', 'rgb(253 251 246 / 72%)', 'rgb(76 73 68 / 90%)'],
      ['--dsw-specific-sidebar-fill', '#f1ece3', '#2a2824'],
      ['--dsw-specific-sidebar-nav-item-active', '#f1ecf9', '#383530'],
      ['--dsw-specific-sidebar-nav-item-active-accent', '#e6dcf4', '#423f39'],
      ['--dsw-specific-sidebar-right-flash', '#9a82c8', '#e69a63'],

      // ── Borders ────────────────────────────────────────────────────────────
      ['--dsw-alias-border-inverted', 'rgb(0 0 0 / 0%)', 'rgb(238 233 226 / 6%)'],
      ['--dsw-alias-border-inverted2', 'rgb(0 0 0 / 0%)', 'rgb(238 233 226 / 8%)'],
      // Borders are drawn at 0.5px, which halves their apparent strength once
      // the line is blended into the surface: these values are deliberately
      // darker than the palette's own divider (#ded8c9) so a hairline still
      // reads on the cream surface.
      ['--dsw-alias-border-l1', '#d2c9b6', 'rgb(238 233 226 / 15%)'],
      ['--dsw-alias-border-l2', '#c6bca8', 'rgb(238 233 226 / 22%)'],
      ['--dsw-alias-border-l2-darkmode-thin', '#c6bca8', 'rgb(238 233 226 / 14%)'],
      ['--dsw-alias-border-l3', '#b8ad97', 'rgb(238 233 226 / 26%)'],
      ['--dsw-alias-border-l4', '#aba084', 'rgb(238 233 226 / 33%)'],
      ['--dsw-alias-border-selected', '#bda8e0', '#b08ad6'],

      // ── Brand and buttons ──────────────────────────────────────────────────
      ['--dsw-alias-brand-primary', '#7a5fb0', '#e69a63'],
      ['--dsw-alias-brand-primary-invert', '#242426', '#e69a63'],
      ['--dsw-alias-brand-primary-new-colorprimary-new-color', '#7a5fb0', '#e69a63'],
      ['--dsw-alias-brand-text', '#242426', '#ececea'],
      ['--dsw-alias-button-primary-fill', '#242426', '#e69a63'],
      ['--dsw-alias-button-primary-hover', '#3d3b36', '#f0ae7d'],
      ['--dsw-alias-button-primary-dimmed', '#eae5dc', '#3a3229'],
      ['--dsw-alias-button-contrast-fill', '#3d3b36', '#ececea'],
      ['--dsw-alias-button-elevated-fill', '#fdfbf6', '#3c3934'],
      ['--dsw-alias-button-floating-fill', '#fdfbf6', '#35332e'],
      ['--dsw-alias-button-floating-hover', '#f3eee5', '#3e3b36'],
      ['--dsw-alias-button-ghost-active-border', '#aaa398', '#706d67'],
      ['--dsw-alias-button-ghost-active-fill', '#eae5dc', '#3c3934'],
      ['--dsw-alias-button-ghost-active-hover', '#e4ded4', '#45423e'],
      ['--dsw-alias-button-info-fill', '#8f74c4', '#e69a63'],
      ['--dsw-alias-button-info-hover', '#9f85ce', '#f0ae7d'],
      ['--dsw-alias-button-tool-bar-fill', 'rgb(84 85 87 / 50%)', 'rgb(84 85 87 / 50%)'],
      ['--dsw-alias-button-tool-bar-fill-invisible', 'rgb(31 31 31 / 36%)', 'rgb(31 31 31 / 36%)'],
      ['--dsw-alias-button-tool-bar-hover', 'rgb(84 85 87 / 60%)', 'rgb(84 85 87 / 60%)'],

      // ── Labels ─────────────────────────────────────────────────────────────
      ['--dsw-alias-label-primary', '#242426', '#ececea'],
      ['--dsw-alias-label-primary-dimmed', '#242426', '#dcd9d3'],
      ['--dsw-alias-label-primary-foreground', '#fdfbf6', '#241a12'],
      ['--dsw-alias-label-primary-inverted', '#fdfbf6', '#302e2a'],
      ['--dsw-alias-label-primary-bluish', '#3f5a70', '#c9d6dd'],
      ['--dsw-alias-label-secondary', '#6f6c65', '#a5a29b'],
      ['--dsw-alias-label-tertiary', '#8a857b', '#959187'],
      ['--dsw-alias-label-caption', '#8a857b', '#908c82'],
      ['--dsw-alias-label-dimmed', '#ded9cf', '#403d38'],
      // Dark ink in the dark palette: the two consumers paint it on the amber
      // send circle and on the error chip. Anything that paints it on a dark
      // fill instead would be invisible — use label-primary-* for those.
      ['--dsw-alias-label-on-color', '#fdfbf6', '#241a12'],
      ['--dsw-alias-label-shimmer', 'rgb(36 36 38 / 30%)', 'rgb(238 233 226 / 45%)'],
      ['--dsw-alias-label-deep-diving', '#7a5fb0', '#e8b48c'],
      ['--dsw-alias-label-deep-diving-shimmer', 'rgb(154 130 200 / 45%)', 'rgb(230 154 99 / 45%)'],
      ['--dsw-alias-menu-icon', '#3d3b36', '#dad7d1'],
      ['--dsw-alias-link', '#7d60b3', '#e9a06c'],
      ['--dsw-alias-hovercard-bg', '#33302c', '#4c4944'],
      ['--dsw-alias-hovercard-label-primary', '#fdfbf6', '#fbfbf9'],
      ['--dsw-alias-hovercard-label-secondary', '#d6d3c8', '#cfccc5'],
      ['--dsw-alias-hovercard-label-tertiary', '#b3b0a5', '#a9a79e'],
      ['--dsw-alias-hovercard-state-done', '#c9b3ea', '#e0c9f7'],
      ['--dsw-alias-hovercard-state-error', '#e58e80', '#f0a094'],
      ['--dsw-alias-toast-bg', '#33302c', '#4c4944'],
      ['--dsw-alias-toast-label', '#fdfbf6', '#fbfbf9'],
      ['--dsw-alias-toast-action', '#c3a9ee', '#f0ae7d'],
      ['--dsw-alias-tooltip-bg', '#33302c', '#4c4944'],
      ['--dsw-alias-tooltip-label', '#fdfbf6', '#fbfbf9'],
      ['--dsw-alias-tooltip-key-bg', 'color-mix(in srgb, var(--dsw-alias-tooltip-bg), white 18%)', 'color-mix(in srgb, var(--dsw-alias-tooltip-bg), white 18%)'],

      // ── States ─────────────────────────────────────────────────────────────
      ['--dsw-alias-state-error-primary', '#c94d3d', '#de6b5f'],
      ['--dsw-alias-state-error-secondary', '#d9705f', '#de6b5f'],
      ['--dsw-alias-state-idle-primary', '#c9c2b2', '#67645e'],
      ['--dsw-alias-state-success-primary', '#3f876a', '#63b587'],
      ['--dsw-alias-state-success-secondary', '#5f9d80', '#7cc49b'],
      ['--dsw-alias-state-success-tertiary', '#e9f0e3', '#22302a'],
      ['--dsw-alias-state-warn-primary', '#d9a52e', '#d9a52e'],
      ['--dsw-alias-state-warn-secondary', '#f7c742', '#f7c742'],
      ['--dsw-alias-state-warn-tertiary', '#fbf0cc', '#382f1c'],
      ['--dsw-alias-state-warn-label', '#a8791f', '#e8a95a'],
      ['--dsw-alias-state-done-primary', '#8468bb', '#c9a3f2'],
      ['--dsw-alias-state-business-primary', '#7a5fb0', '#e69a63'],
      ['--dsw-alias-state-business-tertiary', '#efe8f8', '#3b2c1f'],
      ['--dsw-alias-switch-thumb', '#fdfbf6', '#a5a29b'],

      // ── Interaction ────────────────────────────────────────────────────────
      ['--dsw-alias-interactive-bg-hover', 'rgb(36 36 38 / 5%)', 'rgb(238 233 226 / 7%)'],
      ['--dsw-alias-interactive-bg-hover-solid', '#f2ede4', '#3e3b36'],
      ['--dsw-alias-interactive-bg-hover-accent', 'rgb(132 104 187 / 12%)', 'rgb(230 154 99 / 18%)'],
      ['--dsw-alias-interactive-bg-hover-danger', 'rgb(201 77 61 / 6%)', 'rgb(222 107 95 / 15%)'],
      ['--dsw-alias-interactive-bg-active', 'rgb(36 36 38 / 9%)', 'rgb(238 233 226 / 14%)'],
      ['--dsw-alias-turn-trigger-bg', '#f1ede4', 'rgb(238 233 226 / 7%)'],
      ['--dsw-alias-turn-trigger-bg-hover', 'rgb(36 36 38 / 5%)', 'rgb(238 233 226 / 14%)'],

      // ── Charts and trajectory ──────────────────────────────────────────────
      ['--dsw-alias-chart-messages', '#557b91', '#7b9aa4'],
      ['--dsw-alias-chart-system', '#8a857b', '#a5a29b'],
      ['--dsw-alias-chart-tools', '#9a82c8', '#e69a63'],
      ['--dsw-alias-trajectory-accent', '#9a82c8', '#e69a63'],

      // ── Markdown and code ──────────────────────────────────────────────────
      ['--dsw-alias-markdown-citation', '#f1ece3', '#45423c'],
      ['--dsw-alias-markdown-code-block', '#f1ede4', '#272520'],
      ['--dsw-alias-markdown-code-block-banner', '#f1ede4', '#2c2a26'],
      ['--dsw-alias-markdown-code-segment-selected', '#fdfbf6', '#45423c'],
      ['--dsw-alias-markdown-code-segment-unselected', '#eae5dc', '#272520'],
      ['--dsw-alias-markdown-inline-code', '#f1ede4', '#2d2b27'],
      ['--dsw-alias-markdown-placeholder', '#f1ece3', '#2c2a26'],
      ['--dsw-alias-markdown-tag', '#f1ece3', '#2c2a26'],
      ['--dsw-alias-json-tree-hover', 'rgb(36 36 38 / 4%)', 'rgb(238 233 226 / 5%)'],
      ['--dsw-alias-json-tree-icon', '#6f6c65', '#9b988f'],
      ['--dsw-alias-json-tree-keyword', '#6a4aa8', '#c4a9ee'],
      ['--dsw-alias-json-tree-number', '#6a4aa8', '#c4a9ee'],
      ['--dsw-alias-json-tree-property', '#8a4a6b', '#d7a3bd'],
      ['--dsw-alias-json-tree-punctuation', '#242426', '#e9e6e0'],
      ['--dsw-alias-json-tree-string', '#a1402f', '#f0a08e'],
      ['--dsw-alias-code-diff-added', 'rgb(63 135 106 / 10%)', 'rgb(99 181 135 / 12%)'],
      ['--dsw-alias-code-diff-deleted', 'rgb(201 77 61 / 10%)', 'rgb(222 107 95 / 12%)'],
      ['--dsw-alias-file-diff-added-bg', '#e9efdd', '#26382c'],
      ['--dsw-alias-file-diff-added-gutter', '#eff4e7', '#1d2a20'],
      ['--dsw-alias-file-diff-added-marker', '#3f876a', '#41c977'],
      ['--dsw-alias-file-diff-deleted-bg', '#f8e9e5', '#3f2621'],
      ['--dsw-alias-file-diff-deleted-gutter', '#fbf1ee', '#2c1a15'],
      ['--dsw-alias-file-diff-deleted-marker', '#b8452f', '#fa423e'],

      // ── Scrollbars and illustration ────────────────────────────────────────
      ['--dsw-alias-scrollbar-bg-l1', '#e6e0d7', '#585550'],
      ['--dsw-alias-scrollbar-bg-l2', '#e6e0d7', '#615e58'],
      ['--dsw-alias-scrollbar-hover-l1', '#d4cec4', '#615e58'],
      ['--dsw-alias-scrollbar-hover-l2', '#c8c1b4', '#6c6962'],
      ['--dsw-alias-illustration-background', '#f2ede4', '#2c2a26'],
      ['--dsw-alias-illustration-backing', '#d9d3ca', '#4c4944'],
      ['--dsw-alias-illustration-detail', '#cac4ba', '#706d67'],
      ['--dsw-alias-illustration-inset', '#eae5dc', '#4c4944'],
      ['--dsw-alias-illustration-shadow', '#eae5dc', '#4c4944'],
      ['--dsw-alias-illustration-surface', '#eae5dc', '#57544f'],

      // ── macOS vibrancy sidebar (inert on Windows; kept so the palette is
      //    complete on every platform) ───────────────────────────────────────
      ['--dsw-specific-sidebar-glass-collapsed-fill', 'transparent', 'rgb(255 255 255 / 15%)'],
      ['--dsw-specific-sidebar-glass-collapsed-hover', 'rgb(36 36 38 / 5%)', 'rgb(255 255 255 / 20%)'],
      ['--dsw-specific-sidebar-glass-fill', 'rgb(253 251 246 / 55%)', 'rgb(255 255 255 / 15%)'],
      ['--dsw-specific-sidebar-glass-hover', 'rgb(253 251 246 / 30%)', 'rgb(255 255 255 / 20%)'],
      ['--dsw-specific-sidebar-tint', 'color-mix(in srgb, #f1ece3 40%, transparent)', 'color-mix(in srgb, #2a2824 50%, transparent)'],
      ['--dsw-specific-sidebar-wash-bottom', 'rgb(154 130 200 / 7%)', 'rgb(230 154 99 / 6%)'],
      ['--dsw-specific-sidebar-wash-bottom-clear', 'rgb(154 130 200 / 0%)', 'rgb(230 154 99 / 0%)'],
      ['--dsw-specific-sidebar-wash-top', 'rgb(154 130 200 / 9%)', 'rgb(230 154 99 / 7%)'],
      ['--dsw-specific-sidebar-wash-top-clear', 'rgb(154 130 200 / 0%)', 'rgb(230 154 99 / 0%)'],
    ];

    const tokens = {};
    for (const [name, light, dark] of palette) tokens[name] = { light, dark };

    return {
      inject: ['theme'],
      apply(ctx) {
        // One token layer over the active theme: it follows the appearance
        // preference, leaves the theme registry (and the appearance picker)
        // untouched, and the dynamic-plugin facade pins the layer to this
        // package id and hangs its disposer on this fiber, so unloading the
        // bundle removes the layer (a page reload is the reliable path once the
        // bundle is switched off).
        ctx.theme.overrideTokens('overdue-palette', tokens);

        // Hover polish rides the same plugin lifetime as the palette: one owned
        // <style> in head, removed when the bundle unloads.
        ctx.effect(() => {
          const tag = document.createElement('style');
          tag.dataset.plugin = PACKAGE_ID;
          tag.dataset.pluginCss = `${PACKAGE_ID}/icon-hover`;
          tag.textContent = ICON_HOVER_CSS;
          document.head.appendChild(tag);
          return () => { tag.remove(); };
        }, 'overdue-theme: icon hover polish');
      },
    };
  },
});
