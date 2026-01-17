#!/bin/bash
# Seed script for House of Velo Session Types
# Usage: ./seed-session-types.sh <admin_email> <admin_password>

BASE_URL="http://localhost:8080/api"

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: ./seed-session-types.sh <admin_email> <admin_password>"
    exit 1
fi

ADMIN_EMAIL="$1"
ADMIN_PASSWORD="$2"

echo "=== Logging in as admin ==="
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\": \"$ADMIN_EMAIL\", \"password\": \"$ADMIN_PASSWORD\"}")

ADMIN_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$ADMIN_TOKEN" ]; then
    echo "Failed to get admin token. Response: $LOGIN_RESPONSE"
    exit 1
fi

echo "Got admin token: ${ADMIN_TOKEN:0:20}..."

# Helper function to create session type
create_session_type() {
    local name="$1"
    local description="$2"
    local duration="$3"

    RESPONSE=$(curl -s -X POST "$BASE_URL/admin/session-types" \
        -H "Authorization: Bearer $ADMIN_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{\"name\": \"$name\", \"description\": \"$description\", \"durationMinutes\": $duration}")

    echo $RESPONSE | grep -o '"id":[0-9]*' | cut -d':' -f2
}

# Helper function to add option
add_option() {
    local session_id="$1"
    local json="$2"

    curl -s -X POST "$BASE_URL/admin/session-types/$session_id/options" \
        -H "Authorization: Bearer $ADMIN_TOKEN" \
        -H "Content-Type: application/json" \
        -d "$json" > /dev/null
}

echo ""
echo "=== Creating Session Type 1: MV Hitting Evolution ==="
HITTING_EVOLUTION_ID=$(create_session_type \
    "MV Hitting Evolution Program" \
    "Small-group, high-intent training that actually moves the needle. Each Evolution block runs a fixed 8 Hitters + 4 Pitchers so you get real coaching, high reps, and zero dead time. We track your progress with HitTrax, Pocket Radar, Blast Motion, and modern constraint drills + weighted bat/ball work to safely build speed and cleaner, more repeatable mechanics." \
    75)
echo "Created with ID: $HITTING_EVOLUTION_ID"

add_option $HITTING_EVOLUTION_ID '{"name": "Public Drop-In", "description": "Single 75-minute session", "price": 60.00, "pricingType": "ONE_TIME", "maxParticipants": 1}'
add_option $HITTING_EVOLUTION_ID '{"name": "1 Day/Week", "description": "Train your primary track (Hitting)", "price": 225.00, "pricingType": "SUBSCRIPTION", "billingPeriodDays": 28, "sessionsPerWeek": 1, "autoRenew": true, "maxParticipants": 1}'
add_option $HITTING_EVOLUTION_ID '{"name": "2 Days/Week", "description": "Train your primary track (Hitting)", "price": 345.00, "pricingType": "SUBSCRIPTION", "billingPeriodDays": 28, "sessionsPerWeek": 2, "autoRenew": true, "maxParticipants": 1}'
add_option $HITTING_EVOLUTION_ID '{"name": "3 Days/Week", "description": "Can switch between hitting and pitching or focus on one", "price": 420.00, "pricingType": "SUBSCRIPTION", "billingPeriodDays": 28, "sessionsPerWeek": 3, "autoRenew": true, "maxParticipants": 1}'
add_option $HITTING_EVOLUTION_ID '{"name": "Unlimited", "description": "Train Hitting & Pitching. Book multiple sessions/day when space allows", "price": 525.00, "pricingType": "SUBSCRIPTION", "billingPeriodDays": 28, "autoRenew": true, "maxParticipants": 1}'
echo "Added 5 options"

echo ""
echo "=== Creating Session Type 2: MV Pitching Evolution ==="
PITCHING_EVOLUTION_ID=$(create_session_type \
    "MV Pitching Evolution Program" \
    "Small-group, high-intent training that actually moves the needle. Each Evolution block runs a fixed 8 Hitters + 4 Pitchers so you get real coaching, high reps, and zero dead time. We track your progress with HitTrax, Pocket Radar, Blast Motion, and modern constraint drills + weighted bat/ball work to safely build speed and cleaner, more repeatable mechanics." \
    75)
echo "Created with ID: $PITCHING_EVOLUTION_ID"

add_option $PITCHING_EVOLUTION_ID '{"name": "Public Drop-In", "description": "Single 75-minute session", "price": 60.00, "pricingType": "ONE_TIME", "maxParticipants": 1}'
add_option $PITCHING_EVOLUTION_ID '{"name": "1 Day/Week", "description": "Train your primary track (Pitching)", "price": 225.00, "pricingType": "SUBSCRIPTION", "billingPeriodDays": 28, "sessionsPerWeek": 1, "autoRenew": true, "maxParticipants": 1}'
add_option $PITCHING_EVOLUTION_ID '{"name": "2 Days/Week", "description": "Train your primary track (Pitching)", "price": 345.00, "pricingType": "SUBSCRIPTION", "billingPeriodDays": 28, "sessionsPerWeek": 2, "autoRenew": true, "maxParticipants": 1}'
add_option $PITCHING_EVOLUTION_ID '{"name": "3 Days/Week", "description": "Can switch between hitting and pitching or focus on one", "price": 420.00, "pricingType": "SUBSCRIPTION", "billingPeriodDays": 28, "sessionsPerWeek": 3, "autoRenew": true, "maxParticipants": 1}'
add_option $PITCHING_EVOLUTION_ID '{"name": "Unlimited", "description": "Train Hitting & Pitching. Book multiple sessions/day when space allows", "price": 525.00, "pricingType": "SUBSCRIPTION", "billingPeriodDays": 28, "autoRenew": true, "maxParticipants": 1}'
echo "Added 5 options"

echo ""
echo "=== Creating Session Type 3: MV Strength Session ==="
STRENGTH_ID=$(create_session_type \
    "MV Strength Session" \
    "A baseball-specific strength and conditioning program designed to build explosive power, rotational strength, and overall athleticism to get you primed for the upcoming season. This program focuses on core stability, leg strength, shoulder health, and explosive movements that mimic baseball actions." \
    60)
echo "Created with ID: $STRENGTH_ID"

add_option $STRENGTH_ID '{"name": "Single Session", "price": 20.00, "pricingType": "ONE_TIME", "maxParticipants": 1}'
echo "Added 1 option"

echo ""
echo "=== Creating Session Type 4: College Break Group ==="
COLLEGE_BREAK_ID=$(create_session_type \
    "College Break Group" \
    "Home from school and need a spot to keep it rolling? Jump into our College Break Sessions for hitters + pitchers who want a place to throw, pitch, hit, and lift with a competitive vibe. No instruction included just an open gym type deal." \
    120)
echo "Created with ID: $COLLEGE_BREAK_ID"

add_option $COLLEGE_BREAK_ID '{"name": "Single Session", "price": 20.00, "pricingType": "ONE_TIME", "maxParticipants": 1}'
echo "Added 1 option"

echo ""
echo "=== Creating Session Type 5: 30 min Hitting Lesson ==="
HITTING_30_ID=$(create_session_type \
    "30 min Hitting Lesson" \
    "This 30-minute hitting session is perfect for players looking to get in quality reps and make quick, targeted adjustments. Whether you're fine-tuning your mechanics, improving bat speed, or working on approach, this session provides focused instruction and immediate feedback to help you stay sharp. Ideal for in-season tune-ups, pre-game prep, or refining key aspects of your swing without the time commitment of a full lesson!" \
    30)
echo "Created with ID: $HITTING_30_ID"

add_option $HITTING_30_ID '{"name": "1:1", "price": 50.00, "pricingType": "ONE_TIME", "maxParticipants": 1}'
add_option $HITTING_30_ID '{"name": "1:1 Rapsodo", "description": "Includes Rapsodo analytics", "price": 60.00, "pricingType": "ONE_TIME", "maxParticipants": 1}'
add_option $HITTING_30_ID '{"name": "Group (2)", "price": 90.00, "pricingType": "ONE_TIME", "maxParticipants": 2}'
add_option $HITTING_30_ID '{"name": "Group (3)", "price": 120.00, "pricingType": "ONE_TIME", "maxParticipants": 3}'
add_option $HITTING_30_ID '{"name": "Group (4)", "price": 140.00, "pricingType": "ONE_TIME", "maxParticipants": 4}'
add_option $HITTING_30_ID '{"name": "Group Same House (2)", "description": "Discounted rate for siblings", "price": 80.00, "pricingType": "ONE_TIME", "maxParticipants": 2}'
add_option $HITTING_30_ID '{"name": "1:1 With Pro Pitching Machine", "price": 70.00, "pricingType": "ONE_TIME", "maxParticipants": 1}'
echo "Added 7 options"

echo ""
echo "=== Creating Session Type 6: 1 Hour Hitting Lesson ==="
HITTING_60_ID=$(create_session_type \
    "1 Hour Hitting Lesson" \
    "This 60-minute hitting lesson is designed to help players refine their mechanics, improve bat speed, and develop a more consistent, powerful swing. With expert instruction, focused drills, and real-time feedback, hitters will gain the tools they need to drive the ball with confidence. Whether you're making swing adjustments, working on approach, or fine-tuning your timing, this session provides the reps and coaching necessary to take your hitting to the next level!" \
    60)
echo "Created with ID: $HITTING_60_ID"

add_option $HITTING_60_ID '{"name": "1:1", "price": 80.00, "pricingType": "ONE_TIME", "maxParticipants": 1}'
add_option $HITTING_60_ID '{"name": "1:1 Rapsodo", "description": "Includes Rapsodo analytics", "price": 90.00, "pricingType": "ONE_TIME", "maxParticipants": 1}'
add_option $HITTING_60_ID '{"name": "Group (2)", "price": 120.00, "pricingType": "ONE_TIME", "maxParticipants": 2}'
add_option $HITTING_60_ID '{"name": "Group (3)", "price": 140.00, "pricingType": "ONE_TIME", "maxParticipants": 3}'
add_option $HITTING_60_ID '{"name": "Group (4)", "price": 160.00, "pricingType": "ONE_TIME", "maxParticipants": 4}'
add_option $HITTING_60_ID '{"name": "Group Same House (2)", "description": "Discounted rate for siblings", "price": 110.00, "pricingType": "ONE_TIME", "maxParticipants": 2}'
add_option $HITTING_60_ID '{"name": "1:1 With Pro Pitching Machine", "price": 90.00, "pricingType": "ONE_TIME", "maxParticipants": 1}'
echo "Added 7 options"

echo ""
echo "=== Creating Session Type 7: 30 min Pitching Lesson ==="
PITCHING_30_ID=$(create_session_type \
    "30 min Pitching Lesson" \
    "30 Minutes to Sharpen Your Edge – Tune Up, Dial In, and Throw with Purpose!" \
    30)
echo "Created with ID: $PITCHING_30_ID"

add_option $PITCHING_30_ID '{"name": "1:1", "price": 50.00, "pricingType": "ONE_TIME", "maxParticipants": 1}'
add_option $PITCHING_30_ID '{"name": "1:1 Rapsodo", "description": "Includes Rapsodo analytics", "price": 60.00, "pricingType": "ONE_TIME", "maxParticipants": 1}'
add_option $PITCHING_30_ID '{"name": "Group (2)", "price": 90.00, "pricingType": "ONE_TIME", "maxParticipants": 2}'
add_option $PITCHING_30_ID '{"name": "Group (3)", "price": 120.00, "pricingType": "ONE_TIME", "maxParticipants": 3}'
add_option $PITCHING_30_ID '{"name": "Group (4)", "price": 140.00, "pricingType": "ONE_TIME", "maxParticipants": 4}'
add_option $PITCHING_30_ID '{"name": "Group Same House (2)", "description": "Discounted rate for siblings", "price": 80.00, "pricingType": "ONE_TIME", "maxParticipants": 2}'
echo "Added 6 options"

echo ""
echo "=== Creating Session Type 8: 1 Hour Pitching Lesson ==="
PITCHING_60_ID=$(create_session_type \
    "1 Hour Pitching Lesson" \
    "Dial In Your Command, Develop Your Arsenal, and Throw with Confidence." \
    60)
echo "Created with ID: $PITCHING_60_ID"

add_option $PITCHING_60_ID '{"name": "1:1", "price": 80.00, "pricingType": "ONE_TIME", "maxParticipants": 1}'
add_option $PITCHING_60_ID '{"name": "1:1 Rapsodo", "description": "Includes Rapsodo analytics", "price": 90.00, "pricingType": "ONE_TIME", "maxParticipants": 1}'
add_option $PITCHING_60_ID '{"name": "Group (2)", "price": 120.00, "pricingType": "ONE_TIME", "maxParticipants": 2}'
add_option $PITCHING_60_ID '{"name": "Group (3)", "price": 140.00, "pricingType": "ONE_TIME", "maxParticipants": 3}'
add_option $PITCHING_60_ID '{"name": "Group (4)", "price": 160.00, "pricingType": "ONE_TIME", "maxParticipants": 4}'
add_option $PITCHING_60_ID '{"name": "Group Same House (2)", "description": "Discounted rate for siblings", "price": 110.00, "pricingType": "ONE_TIME", "maxParticipants": 2}'
echo "Added 6 options"

echo ""
echo "=== Creating Session Type 9: 1 Hour Skills Lesson ==="
SKILLS_60_ID=$(create_session_type \
    "1 Hour Skills Lesson" \
    "Refine your game with our comprehensive skills training at House of Velo. Whether you want to focus on hitting, fielding, pitching, or a combination, our training sessions cover all aspects of the game. Perfect for players of all levels looking for top-tier coaching and improvement." \
    60)
echo "Created with ID: $SKILLS_60_ID"

add_option $SKILLS_60_ID '{"name": "1:1", "price": 90.00, "pricingType": "ONE_TIME", "maxParticipants": 1}'
add_option $SKILLS_60_ID '{"name": "Group (2)", "price": 130.00, "pricingType": "ONE_TIME", "maxParticipants": 2}'
add_option $SKILLS_60_ID '{"name": "Group (3)", "price": 150.00, "pricingType": "ONE_TIME", "maxParticipants": 3}'
add_option $SKILLS_60_ID '{"name": "Group (4)", "price": 170.00, "pricingType": "ONE_TIME", "maxParticipants": 4}'
add_option $SKILLS_60_ID '{"name": "Group Same House (2)", "description": "Discounted rate for siblings", "price": 120.00, "pricingType": "ONE_TIME", "maxParticipants": 2}'
echo "Added 5 options"

echo ""
echo "=== Creating Session Type 10: 90 min Combo Lesson ==="
COMBO_90_ID=$(create_session_type \
    "90 min Combo Lesson (2 skills)" \
    "Work on Two Skills (pitching/hitting/catching/fielding). Refine your game with our comprehensive skills training at House of Velo. Whether you want to focus on hitting, fielding, pitching, or a combination, our training sessions cover all aspects of the game. Perfect for players of all levels looking for top-tier coaching and improvement." \
    90)
echo "Created with ID: $COMBO_90_ID"

add_option $COMBO_90_ID '{"name": "1:1", "price": 120.00, "pricingType": "ONE_TIME", "maxParticipants": 1}'
add_option $COMBO_90_ID '{"name": "Group (2)", "price": 160.00, "pricingType": "ONE_TIME", "maxParticipants": 2}'
add_option $COMBO_90_ID '{"name": "Group (3)", "price": 180.00, "pricingType": "ONE_TIME", "maxParticipants": 3}'
add_option $COMBO_90_ID '{"name": "Group (4)", "price": 200.00, "pricingType": "ONE_TIME", "maxParticipants": 4}'
add_option $COMBO_90_ID '{"name": "Group Same House (2)", "description": "Discounted rate for siblings", "price": 150.00, "pricingType": "ONE_TIME", "maxParticipants": 2}'
echo "Added 5 options"

echo ""
echo "=== DONE! ==="
echo "Created 10 session types with 48 total pricing options"
echo ""
echo "Verifying - fetching all session types:"
curl -s "$BASE_URL/session-types" | head -c 500
echo "..."
