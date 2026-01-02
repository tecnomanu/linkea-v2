<?php

namespace App\Support\Helpers;

/**
 * Helper to generate inline SVG sparklines for emails.
 * 
 * Sparklines are small, simple charts that show trends.
 * We generate inline SVG because external images don't work well in emails.
 */
class SparklineHelper
{
    /**
     * Generate an inline SVG sparkline from data array.
     * 
     * @param array $data Array of numeric values
     * @param int $width Width in pixels
     * @param int $height Height in pixels
     * @param string $lineColor Color of the line (hex)
     * @param string $fillColor Color of the fill area (hex)
     * @return string SVG markup
     */
    public static function generateSVG(
        array $data,
        int $width = 100,
        int $height = 30,
        string $lineColor = '#3b82f6',
        string $fillColor = '#93c5fd'
    ): string {
        if (empty($data)) {
            return self::generateEmptySparkline($width, $height);
        }

        // Normalize data
        $max = max($data);
        $min = min($data);
        $range = $max - $min;

        // Avoid division by zero
        if ($range === 0) {
            $range = 1;
        }

        $count = count($data);
        $stepX = $width / ($count - 1);
        
        // Generate points for the line
        $points = [];
        foreach ($data as $index => $value) {
            $x = $index * $stepX;
            $y = $height - (($value - $min) / $range * $height);
            $points[] = [$x, $y];
        }

        // Build polyline path for the line
        $linePoints = implode(' ', array_map(fn($p) => "{$p[0]},{$p[1]}", $points));

        // Build polygon path for the filled area
        $fillPoints = $linePoints . " {$width},{$height} 0,{$height}";

        // Generate SVG
        $svg = <<<SVG
<svg width="{$width}" height="{$height}" xmlns="http://www.w3.org/2000/svg" style="display: block; margin: 0 auto;">
    <!-- Filled area -->
    <polygon points="{$fillPoints}" fill="{$fillColor}" opacity="0.5" />
    <!-- Line -->
    <polyline points="{$linePoints}" fill="none" stroke="{$lineColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    <!-- Data points (small circles) -->
SVG;

        // Add small circles at each data point
        foreach ($points as $point) {
            $svg .= "\n    <circle cx=\"{$point[0]}\" cy=\"{$point[1]}\" r=\"2\" fill=\"{$lineColor}\" />";
        }

        $svg .= "\n</svg>";

        return $svg;
    }

    /**
     * Generate an empty sparkline (flat line).
     */
    protected static function generateEmptySparkline(int $width, int $height): string
    {
        $y = $height / 2;
        
        return <<<SVG
<svg width="{$width}" height="{$height}" xmlns="http://www.w3.org/2000/svg" style="display: block; margin: 0 auto;">
    <line x1="0" y1="{$y}" x2="{$width}" y2="{$y}" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="2,2" />
</svg>
SVG;
    }

    /**
     * Generate a bar chart SVG (alternative visualization).
     * 
     * @param array $data Array of numeric values
     * @param int $width Width in pixels
     * @param int $height Height in pixels
     * @param string $barColor Color of bars (hex)
     * @return string SVG markup
     */
    public static function generateBarChart(
        array $data,
        int $width = 100,
        int $height = 30,
        string $barColor = '#f97316'
    ): string {
        if (empty($data)) {
            return self::generateEmptySparkline($width, $height);
        }

        $max = max($data);
        $count = count($data);
        $barWidth = ($width / $count) * 0.7; // 70% width, 30% gap
        $gap = ($width / $count) * 0.3;

        $svg = "<svg width=\"{$width}\" height=\"{$height}\" xmlns=\"http://www.w3.org/2000/svg\" style=\"display: block; margin: 0 auto;\">";

        foreach ($data as $index => $value) {
            $barHeight = $max > 0 ? ($value / $max) * $height : 0;
            $x = $index * ($barWidth + $gap) + ($gap / 2);
            $y = $height - $barHeight;

            $opacity = 0.6 + ($value / ($max ?: 1)) * 0.4; // Varying opacity based on value

            $svg .= "\n    <rect x=\"{$x}\" y=\"{$y}\" width=\"{$barWidth}\" height=\"{$barHeight}\" fill=\"{$barColor}\" opacity=\"{$opacity}\" rx=\"1\" />";
        }

        $svg .= "\n</svg>";

        return $svg;
    }
}

