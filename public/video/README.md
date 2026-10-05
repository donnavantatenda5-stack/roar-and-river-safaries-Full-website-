# Copy your MP4 here as `hero.mp4` — this file is a placeholder.

# What the hero video background expects
#
#   public/video/hero.mp4
#
# Recommendations:
#   Format      H.264 MP4 (works in every browser)
#   Resolution  1920x1080 or larger, landscape 16:9
#   Length      60s or more, so the middle 30s loop has room
#   Audio       none / silent strip. Browsers block unmuted autoplay,
#               so any audio track would be muted on load anyway.
#   File size   under ~8 MB. Keep it compressed or the hero will delay
#               paint on mobile data.
#
# Trim the source so the chosen 30 second window has no abrupt start or
# finish, since that segment loops on a timer.