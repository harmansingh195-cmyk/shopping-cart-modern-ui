$requiredDocs = @(
  "src/docs/requirements.md",
  "src/docs/architecture.md",
  "src/docs/design-review.md",
  "src/docs/impl-plan.md",
  "src/docs/pr-description.md",
  "src/docs/review-report.md",
  "src/docs/verification-report.md"
)

$missingDocs = @()

foreach ($doc in $requiredDocs) {
  $fullPath = Join-Path -Path (Get-Location) -ChildPath $doc
  if (-not (Test-Path -Path $fullPath -PathType Leaf)) {
    $missingDocs += $doc
  }
}

if ($missingDocs.Count -gt 0) {
  foreach ($missing in $missingDocs) {
    Write-Host "Missing required doc: $missing"
  }
  Write-Error "PR validation failed: required docs are missing."
  exit 1
}

Write-Host "PR validation passed: all required docs exist."
