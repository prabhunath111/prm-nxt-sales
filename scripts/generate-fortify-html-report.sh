#!/bin/bash
# Generate comprehensive HTML report from Fortify FPR files
# Usage: ./generate-fortify-html-report.sh <output_dir> <service_name>

OUTPUT_DIR="$1"
SERVICE_NAME="$2"

# Generate comprehensive HTML report
cat > "${OUTPUT_DIR}/${SERVICE_NAME}-fortify-report.html" << 'HTMLEOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fortify SAST Analysis Report</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #f5f5f5; padding: 20px; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
        .header h1 { font-size: 28px; margin-bottom: 10px; }
        .header .subtitle { opacity: 0.9; font-size: 18px; }
        .header .meta { margin-top: 15px; font-size: 14px; opacity: 0.8; }
        .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; padding: 30px; }
        .metric-card { background: #f8f9fa; padding: 20px; border-radius: 6px; border-left: 4px solid #667eea; }
        .metric-card.critical { border-left-color: #dc3545; }
        .metric-card.high { border-left-color: #fd7e14; }
        .metric-card.medium { border-left-color: #ffc107; }
        .metric-card.low { border-left-color: #28a745; }
        .metric-label { font-size: 12px; text-transform: uppercase; color: #6c757d; margin-bottom: 8px; font-weight: 600; }
        .metric-value { font-size: 32px; font-weight: bold; color: #333; }
        .section { padding: 30px; border-top: 1px solid #e9ecef; }
        .section-title { font-size: 20px; font-weight: 600; color: #333; margin-bottom: 20px; display: flex; align-items: center; }
        .section-title::before { content: '\ud83d\udcca'; margin-right: 10px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        thead { background: #f8f9fa; }
        th { padding: 12px; text-align: left; font-weight: 600; color: #495057; border-bottom: 2px solid #dee2e6; }
        td { padding: 12px; border-bottom: 1px solid #e9ecef; }
        tr:hover { background: #f8f9fa; }
        .severity-badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: 600; text-transform: uppercase; }
        .severity-critical { background: #dc3545; color: white; }
        .severity-high { background: #fd7e14; color: white; }
        .severity-medium { background: #ffc107; color: #000; }
        .severity-low { background: #28a745; color: white; }
        .issue-detail { background: #f8f9fa; padding: 20px; border-radius: 6px; margin-bottom: 15px; border-left: 4px solid #667eea; }
        .issue-detail .issue-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .issue-detail .issue-title { font-weight: 600; font-size: 16px; color: #333; }
        .issue-detail .issue-location { color: #6c757d; font-size: 14px; margin-top: 8px; font-family: 'Courier New', monospace; }
        .issue-detail .issue-description { margin-top: 10px; line-height: 1.6; color: #495057; }
        pre { background: #f8f9fa; padding: 15px; border-radius: 4px; overflow-x: auto; font-size: 13px; line-height: 1.5; }
        .no-issues { text-align: center; padding: 40px; color: #28a745; font-size: 18px; }
        .no-issues::before { content: '\u2705'; font-size: 48px; display: block; margin-bottom: 15px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔒 Fortify SAST Analysis Report</h1>
            <div class="subtitle">SERVICE_NAME_PLACEHOLDER</div>
            <div class="meta">Report Generated: REPORT_DATE_PLACEHOLDER</div>
        </div>
HTMLEOF

# Add metrics section
echo "        <div class=\"metrics\">" >> "${OUTPUT_DIR}/${SERVICE_NAME}-fortify-report.html"

# Count issues
TOTAL_ISSUES=$(grep -c "^" "${OUTPUT_DIR}/all_issues.txt" 2>/dev/null || echo "0")
CRITICAL_COUNT=$(grep -i "critical" "${OUTPUT_DIR}/critical_issues.txt" 2>/dev/null | grep -oE '[0-9]+' | head -1 || echo "0")
HIGH_COUNT=$(grep -i "high" "${OUTPUT_DIR}/high_issues.txt" 2>/dev/null | grep -oE '[0-9]+' | head -1 || echo "0")

cat >> "${OUTPUT_DIR}/${SERVICE_NAME}-fortify-report.html" << METRICSEOF
            <div class="metric-card">
                <div class="metric-label">Total Issues</div>
                <div class="metric-value">${TOTAL_ISSUES}</div>
            </div>
            <div class="metric-card critical">
                <div class="metric-label">Critical</div>
                <div class="metric-value">${CRITICAL_COUNT}</div>
            </div>
            <div class="metric-card high">
                <div class="metric-label">High</div>
                <div class="metric-value">${HIGH_COUNT}</div>
            </div>
METRICSEOF

echo "        </div>" >> "${OUTPUT_DIR}/${SERVICE_NAME}-fortify-report.html"

# Add Issues Summary section
cat >> "${OUTPUT_DIR}/${SERVICE_NAME}-fortify-report.html" << 'SUMMARYEOF'
        <div class="section">
            <h2 class="section-title">Issues Summary</h2>
            <table>
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Count</th>
                    </tr>
                </thead>
                <tbody>
SUMMARYEOF

# Parse category counts
if [ -f "${OUTPUT_DIR}/category_counts.txt" ]; then
  grep -E '".*" => [0-9]+ Issue' "${OUTPUT_DIR}/category_counts.txt" 2>/dev/null | while IFS= read -r line; do
    CATEGORY=$(echo "$line" | sed -E 's/"(.*)\" => [0-9]+ Issue.*/\1/')
    COUNT=$(echo "$line" | grep -oE '[0-9]+' | head -1)
    echo "                    <tr><td>${CATEGORY}</td><td>${COUNT}</td></tr>" >> "${OUTPUT_DIR}/${SERVICE_NAME}-fortify-report.html"
  done
fi

cat >> "${OUTPUT_DIR}/${SERVICE_NAME}-fortify-report.html" << 'SUMMARYENDEOF'
                </tbody>
            </table>
        </div>
        
        <div class="section">
            <h2 class="section-title">Detailed Issues</h2>
SUMMARYENDEOF

# Parse detailed issues
if [ -f "${OUTPUT_DIR}/all_issues.txt" ] && [ -s "${OUTPUT_DIR}/all_issues.txt" ]; then
  ISSUE_NUM=1
  while IFS= read -r issue_line; do
    if [[ $issue_line =~ ^builds/ ]] || [[ $issue_line =~ ^src/ ]]; then
      FILE_PATH=$(echo "$issue_line" | cut -d: -f1)
      LINE_NUM=$(echo "$issue_line" | cut -d: -f2 | grep -oE '^[0-9]+')
      cat >> "${OUTPUT_DIR}/${SERVICE_NAME}-fortify-report.html" << ISSUEEOF
            <div class="issue-detail">
                <div class="issue-header">
                    <div class="issue-title">Issue #${ISSUE_NUM}</div>
                    <span class="severity-badge severity-medium">Medium</span>
                </div>
                <div class="issue-location">📁 ${FILE_PATH}:${LINE_NUM}</div>
                <div class="issue-description">Security vulnerability detected. Review this code location for potential security risks.</div>
            </div>
ISSUEEOF
      ISSUE_NUM=$((ISSUE_NUM + 1))
    fi
  done < "${OUTPUT_DIR}/all_issues.txt"
else
  echo "            <div class=\"no-issues\">No security issues found! 🎉</div>" >> "${OUTPUT_DIR}/${SERVICE_NAME}-fortify-report.html"
fi

cat >> "${OUTPUT_DIR}/${SERVICE_NAME}-fortify-report.html" << 'FOOTEREOF'
        </div>
        
        <div class="section">
            <h2 class="section-title">Raw Fortify Output</h2>
            <pre>
FOOTEREOF

cat "${OUTPUT_DIR}/category_counts.txt" >> "${OUTPUT_DIR}/${SERVICE_NAME}-fortify-report.html" 2>/dev/null || echo "No data available" >> "${OUTPUT_DIR}/${SERVICE_NAME}-fortify-report.html"

cat >> "${OUTPUT_DIR}/${SERVICE_NAME}-fortify-report.html" << 'ENDEOF'
            </pre>
        </div>
    </div>
</body>
</html>
ENDEOF

# Replace placeholders
sed -i.bak "s/SERVICE_NAME_PLACEHOLDER/${SERVICE_NAME}/g" "${OUTPUT_DIR}/${SERVICE_NAME}-fortify-report.html"
sed -i.bak "s/REPORT_DATE_PLACEHOLDER/$(date '+%Y-%m-%d %H:%M:%S')/g" "${OUTPUT_DIR}/${SERVICE_NAME}-fortify-report.html"
rm -f "${OUTPUT_DIR}/${SERVICE_NAME}-fortify-report.html.bak"

echo "HTML report generated: ${OUTPUT_DIR}/${SERVICE_NAME}-fortify-report.html"
