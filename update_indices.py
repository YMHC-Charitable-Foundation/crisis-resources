import os
import re

DOCS_DIR = r"C:\Users\pc\Documents\GitHub\crisis-support-directory\crisis-resources\docs"

def get_frontmatter_title(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Extract frontmatter block: between first two ---
        # Note: file must start with ---
        fm_match = re.match(r'^---\s*\n(.*?)\n---\s*', content, re.DOTALL)
        if fm_match:
            fm_text = fm_match.group(1)
            # Find title line: title: ...
            # Support yaml keys which might not be at start of line if indented? 
            # Usually top level keys are at start of line in these md files.
            title_match = re.search(r'^title:\s*(.*)$', fm_text, re.MULTILINE)
            if title_match:
                title_raw = title_match.group(1).strip()
                # Remove wrapping quotes if present
                if (title_raw.startswith('"') and title_raw.endswith('"')) or \
                   (title_raw.startswith("'") and title_raw.endswith("'")):
                    return title_raw[1:-1]
                return title_raw
                
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        
    return None

def update_index_in_dir(directory):
    # Find all .md files excluding index.md
    md_files = [f for f in os.listdir(directory) if f.endswith(".md") and f != "index.md"]
    
    if not md_files:
        return

    md_files.sort()

    links = []
    for md_file in md_files:
        path = os.path.join(directory, md_file)
        title = get_frontmatter_title(path)
        
        if not title:
            # Fallback to filename formatting
            # e.g. some-file-name.md -> Some File Name
            print(f"Warning: No title found for {md_file}, using filename.")
            title = os.path.splitext(md_file)[0].replace("-", " ").title()
        
        # Escape brackets in title if needed? Markdown usually handles text fine in links unless it has [] inside.
        # But let's assume titles are safe-ish.
        link = f"- [{title}](./{md_file})"
        links.append(link)

    index_path = os.path.join(directory, "index.md")
    
    existing_content = ""
    folder_name = os.path.basename(directory).replace("-", " ").title()
    
    if os.path.exists(index_path):
        with open(index_path, 'r', encoding='utf-8') as f:
            existing_content = f.read()
    else:
        # Create default content if missing
        existing_content = f"---\ntitle: {folder_name}\n---\n\n## Resources\n"

    # Define markers to look for (splitting point)
    # We want to maintain everything BEFORE "## Resources" (or variant)
    # and replace everything AFTER it with the new list.
    
    markers = ["## Resources", "## Ressources", "## Canada Nationwide Resources"]
    
    marker_found = None
    split_index = -1
    
    for marker in markers:
        idx = existing_content.find(marker)
        if idx != -1:
            marker_found = marker
            split_index = idx
            break
            
    if marker_found:
        # existing_content[:split_index] is everything before marker
        # We want to keep the marker line too.
        
        # Find the end of the marker line
        # existing_content[split_index:] starts with the marker.
        marker_line_end_rel = existing_content[split_index:].find('\n')
        if marker_line_end_rel == -1:
            marker_line_end = len(existing_content)
        else:
            marker_line_end = split_index + marker_line_end_rel
            
        pre_content = existing_content[:marker_line_end] # Includes the marker line
        new_content = pre_content.strip() + "\n\n" + "\n".join(links) + "\n"
        
    else:
        # Append marker and list
        new_content = existing_content.strip() + "\n\n## Resources\n\n" + "\n".join(links) + "\n"

    # Write back
    with open(index_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Updated {index_path} with {len(links)} links.")

def main():
    print("Starting index update...")
    for root, dirs, files in os.walk(DOCS_DIR):
        # We only care if there are md files other than index.md
        # Also, check if this is a directory we want to summarize.
        # "docs" root might have introduction, let's verify if we should run on it.
        # User said "for all folders including nationwide and provincial".
        # If 'docs' root has md files (like intro stuff), maybe we shouldn't overwrite unless we are sure.
        # But let's assume if it has index.md and other mds, we might want to update.
        # However, usually root index.md is special.
        # Let's restrict to subdirectories of docs if needed, or just be careful.
        # If I see "## Resources" I replace it. If not, I append. This is safe.
        
        # Check if there are candidate files
        candidates = [f for f in files if f.endswith(".md") and f != "index.md"]
        if candidates:
            # Check if index.md exists. If not, maybe create? User asked for "file list".
            # If no index.md exists, creating one might be aggressive if it's just a folder of assets or partials?
            # But "docs" usually implies pages.
            update_index_in_dir(root)
            
    print("Done.")

if __name__ == "__main__":
    main()
