import van from "../../../deps/mini-van-0.3.8.min.js";
import { tagToName } from "../../tagToName.js";

const { div, p, span, textarea, picture, img, button, a } = van.tags;

function StepDescription(child) {
  return p({ class: 'step-description' },
    span({ class: 'text-content' },
      span({ class: 'index' }),
      child,
    ),
    button({ class: 'text-button delete-button', 'wtc-editor': 1 }, 'Remove step'),
  );
}

export function StartingStep({ url }) {
  return div({ class: 'step', 'wtc-step-index': 1 },
    StepDescription(span({ class: 'content' }, ['Visit ', a({ href: url }, url), '.']))
  );
}

export function BackNavigationStep({ url, index }) {
  return div({ class: 'step', 'wtc-step-index': index },
    StepDescription(span({ class: 'content' }, ['Go back to ', a({ href: url }, url), '.']))
  );
}

export function ScreenshotStep({ image, target }, index) {
  const actionDescription = tagToName[target.tagName] ? `${tagToName[target.tagName]}` : '';

  return div({ class: 'step', 'wtc-step-index': index + 2 },
    StepDescription(
      textarea({ class: 'content', 'wtc-textarea': 0 },
        `Click "${target.innerText}" ${actionDescription}.`
      ),
    ),
    div({ class: 'step-image' },
      picture(
        img({ class: 'screenshot', src: image }),
        div({ class: 'scrub-overlay' }),
        div({ class: 'loading-overlay' }),
      ),
    ),
  );
}
