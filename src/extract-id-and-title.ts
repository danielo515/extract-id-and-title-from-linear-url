import { Clipboard, Toast, getPreferenceValues, showHUD, showToast } from "@raycast/api";

type Parsed = { id: string; title?: string };

const parseLinearUrl = (u: URL): Parsed | null => {
  if (u.hostname !== "linear.app") return null;
  const parts = u.pathname.split("/").filter((p) => p.length > 0);
  const issueIdx = parts.findIndex((p) => p.toLowerCase() === "issue");
  if (issueIdx === -1) return null;
  const idPart = parts[issueIdx + 1];
  if (!idPart) return null;

  const [team, number] = idPart.split("-");
  if (!team || !number || !/^[0-9]+$/.test(number)) return null;
  const id = `${team.toUpperCase()}-${number}`;

  const slug = parts[issueIdx + 2];
  if (!slug) return { id };

  const decoded = decodeURIComponent(slug).trim();
  const titleRaw = decoded.replace(/\s+/g, "-");
  const title = titleRaw.replace(/-/g, " ").trim();
  if (title.length === 0) return { id };
  return { id, title };
};

export default async function main(): Promise<void> {
  const text = (await Clipboard.readText())?.trim();
  if (!text) {
    await showToast({ style: Toast.Style.Failure, title: "Clipboard is empty" });
    return;
  }

  let url: URL;
  try {
    url = new URL(text);
  } catch {
    await showToast({ style: Toast.Style.Failure, title: "Clipboard is not a URL" });
    return;
  }

  const parsed = parseLinearUrl(url);
  if (!parsed) {
    await showToast({ style: Toast.Style.Failure, title: "Not a Linear issue URL" });
    return;
  }

  const prefs = getPreferenceValues<{ separator?: string }>();
  const configuredSep = (prefs.separator ?? ":").trim();
  const sep = configuredSep.length > 0 ? ` ${configuredSep} ` : ": ";
  const output = parsed.title ? `${parsed.id}${sep}${parsed.title}` : parsed.id;
  await Clipboard.copy(output);

  if (parsed.title) {
    await showToast({ style: Toast.Style.Success, title: "Copied", message: output });
    await showHUD(`Copied: ${output}`);
  } else {
    await showToast({ style: Toast.Style.Animated, title: "Copied ID (no slug)", message: output });
    await showHUD(`Copied ID (no slug): ${output}`);
  }
}
