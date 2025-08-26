import { PrismEditor } from "prism-react-editor";
import { IndentGuides } from "prism-react-editor/guides";
import { useBracketMatcher } from "prism-react-editor/match-brackets";
import { useHighlightBracketPairs } from "prism-react-editor/highlight-brackets";
import {
  useHighlightSelectionMatches,
  useSearchWidget,
  useShowInvisibles,
} from "prism-react-editor/search";
import {
  useHighlightMatchingTags,
  useTagMatcher,
} from "prism-react-editor/match-tags";
import { useCursorPosition } from "prism-react-editor/cursor";
import {
  useDefaultCommands,
  useEditHistory,
} from "prism-react-editor/commands";
import { useCopyButton } from "prism-react-editor/copy-button";
import { useOverscroll } from "prism-react-editor/overscroll";
import "prism-react-editor/prism/languages/jsx";
import "prism-react-editor/layout.css";
// Needed for the search widget
import "prism-react-editor/search.css";
// Needed for the copy button
import "prism-react-editor/copy-button.css";

function MyExtensions({ editor }: { editor: PrismEditor }) {
  useBracketMatcher(editor);
  useHighlightBracketPairs(editor);
  useOverscroll(editor);
  useTagMatcher(editor);
  useHighlightMatchingTags(editor);
  useDefaultCommands(editor);
  useEditHistory(editor);
  useSearchWidget(editor);
  useHighlightSelectionMatches(editor);
  useShowInvisibles(editor);
  useCopyButton(editor);
  useCursorPosition(editor);

  return <IndentGuides editor={editor} />;
}

export default MyExtensions;
