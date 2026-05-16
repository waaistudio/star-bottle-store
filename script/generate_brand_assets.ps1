Add-Type -AssemblyName System.Drawing
$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$assets = Join-Path $root "assets"

function New-Canvas($size) {
  $bitmap = New-Object System.Drawing.Bitmap $size, $size
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  return @($bitmap, $graphics)
}

function Add-Background($graphics, $size) {
  $rect = New-Object System.Drawing.Rectangle 0, 0, $size, $size
  $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect, ([System.Drawing.Color]::FromArgb(255, 8, 24, 50)), ([System.Drawing.Color]::FromArgb(255, 76, 63, 143)), 45
  $graphics.FillRectangle($brush, $rect)
  $brush.Dispose()

  $seaBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(210, 12, 93, 119))
  $graphics.FillEllipse($seaBrush, -80, [int]($size * 0.58), $size + 160, [int]($size * 0.62))
  $seaBrush.Dispose()
}

function Add-Star($graphics, $x, $y, $r) {
  $points = New-Object System.Drawing.PointF[] 4
  $points[0] = New-Object System.Drawing.PointF $x, ($y - $r)
  $points[1] = New-Object System.Drawing.PointF ($x + $r), $y
  $points[2] = New-Object System.Drawing.PointF $x, ($y + $r)
  $points[3] = New-Object System.Drawing.PointF ($x - $r), $y
  $brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 255, 226, 122))
  $graphics.FillPolygon($brush, $points)
  $brush.Dispose()
}

function New-RoundedPath($rect, $radius) {
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $diameter = $radius * 2
  $path.AddArc($rect.X, $rect.Y, $diameter, $diameter, 180, 90)
  $path.AddArc(($rect.Right - $diameter), $rect.Y, $diameter, $diameter, 270, 90)
  $path.AddArc(($rect.Right - $diameter), ($rect.Bottom - $diameter), $diameter, $diameter, 0, 90)
  $path.AddArc($rect.X, ($rect.Bottom - $diameter), $diameter, $diameter, 90, 90)
  $path.CloseFigure()
  return $path
}

function Fill-RoundedRect($graphics, $brush, $rect, $radius) {
  $path = New-RoundedPath $rect $radius
  $graphics.FillPath($brush, $path)
  $path.Dispose()
}

function Draw-RoundedRect($graphics, $pen, $rect, $radius) {
  $path = New-RoundedPath $rect $radius
  $graphics.DrawPath($pen, $path)
  $path.Dispose()
}

function Add-Bottle($graphics, $size) {
  $graphics.TranslateTransform([float]($size * 0.51), [float]($size * 0.52))
  $graphics.RotateTransform(-18)

  $glass = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(185, 185, 248, 250))
  $line = New-Object System.Drawing.Pen -ArgumentList ([System.Drawing.Color]::FromArgb(230, 255, 255, 255)), ([float]($size * 0.018))
  $paper = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 255, 244, 191))
  $cork = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 186, 138, 84))

  $body = New-Object System.Drawing.RectangleF ([float](-$size * 0.13), [float](-$size * 0.04), [float]($size * 0.26), [float]($size * 0.36))
  $neck = New-Object System.Drawing.RectangleF ([float](-$size * 0.065), [float](-$size * 0.24), [float]($size * 0.13), [float]($size * 0.23))
  $note = New-Object System.Drawing.RectangleF ([float](-$size * 0.075), [float]($size * 0.04), [float]($size * 0.15), [float]($size * 0.22))
  $cap = New-Object System.Drawing.RectangleF ([float](-$size * 0.075), [float](-$size * 0.29), [float]($size * 0.15), [float]($size * 0.055))

  Fill-RoundedRect $graphics $glass $body ([float]($size * 0.08))
  Draw-RoundedRect $graphics $line $body ([float]($size * 0.08))
  Fill-RoundedRect $graphics $glass $neck ([float]($size * 0.04))
  Draw-RoundedRect $graphics $line $neck ([float]($size * 0.04))
  Fill-RoundedRect $graphics $paper $note ([float]($size * 0.025))
  Fill-RoundedRect $graphics $cork $cap ([float]($size * 0.02))

  $glass.Dispose()
  $line.Dispose()
  $paper.Dispose()
  $cork.Dispose()
  $graphics.ResetTransform()
}

function Save-Icon($path, $size) {
  $pair = New-Canvas $size
  $bitmap = $pair[0]
  $graphics = $pair[1]

  Add-Background $graphics $size
  Add-Star $graphics ([float]($size * 0.28)) ([float]($size * 0.26)) ([float]($size * 0.035))
  Add-Star $graphics ([float]($size * 0.73)) ([float]($size * 0.22)) ([float]($size * 0.028))
  Add-Star $graphics ([float]($size * 0.78)) ([float]($size * 0.68)) ([float]($size * 0.04))
  Add-Bottle $graphics $size

  $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $graphics.Dispose()
  $bitmap.Dispose()
}

Save-Icon (Join-Path $assets "icon.png") 1024
Save-Icon (Join-Path $assets "adaptive-icon.png") 1024
Save-Icon (Join-Path $assets "splash-icon.png") 1024
Save-Icon (Join-Path $assets "favicon.png") 128
