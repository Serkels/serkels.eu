//

import { addDynamicIconSelectors } from "@iconify/tailwind";
import {
  cleanupSVG,
  importDirectorySync,
  isEmptyColor,
  parseColorsSync,
  runSVGO,
} from "@iconify/tools";

//

export function custom_icon_set(folder_path: string) {
  // Import icons from directory 'svg'
  const customSet = importDirectorySync(folder_path);

  // Clean up all icons
  customSet.forEachSync((name, type) => {
    if (type !== "icon") {
      return;
    }

    // Get SVG object for icon
    const svg = customSet.toSVG(name);
    if (!svg) {
      // Invalid icon
      customSet.remove(name);
      return;
    }

    try {
      // Clean up icon
      cleanupSVG(svg);

      // This is a monotone icon, change color to `currentColor`, add it if missing
      // Skip this step if icons have palette
      parseColorsSync(svg, {
        defaultColor: "currentColor",
        callback: (_attr, colorStr, color) => {
          return !color || isEmptyColor(color) ? colorStr : "currentColor";
        },
      });

      // Optimise icon
      runSVGO(svg);
    } catch (err) {
      // Something went wrong when parsing icon: remove it
      console.error(`Error parsing ${name}:`, err);
      customSet.remove(name);
      return;
    }

    // Update icon in icon set from SVG object
    customSet.fromSVG(name, svg);
  });

  return addDynamicIconSelectors({
    iconSets: {
      tt: customSet.export(),
    },
  });
}
