# NVL Compiler Guide & Best Practices

## Common Errors & Solutions

### 1. Spatial Mismatch (`E_SPATIAL_MISMATCH`)
**Error**: `USE requires same location. ActorA@LocA, ActorB@LocA # Comment`.
**Cause**: The NVL parser treats inline comments in `SET` strings as part of the value.
**Fix**: **NEVER use inline comments with string values.**
```nvl
# BAD
SET Detective_Jack.location = Office # Inside

# GOOD
# Inside
SET Detective_Jack.location = Office
```

### 2. Unknown Command (`E_UNKNOWN_COMMAND`)
**Error**: `Unknown command 'LOCATION'`.
**Cause**: `LOCATION` is an implicit state string, not a command.
**Fix**: Do not declare locations. Just use them in `SET` statements.
```nvl
# BAD
LOCATION Sector_7

# GOOD
SET Detective_Jack.location = Sector_7
```

### 3. Missing Items (`E_ITEM_MISSING`)
**Error**: `Actor cannot USE missing item 'Coffee_Machine'`.
**Cause**: Actors can only interact with named items in their inventory.
**Fix**: For environmental fixtures (Desks, Machines), `GIVE` them to the actor at the start of the script/scene to enable interaction.
```nvl
# Setup Fixtures
GIVE Detective_Jack Coffee_Machine
ACTION USE subject=Detective_Jack item=Coffee_Machine target=Detective_Jack
```

### 4. Relate Unknown Actor (`E_RELATE_ACTOR`)
**Error**: `RELATE references unknown actor(s)`.
**Cause**: Referring to a global faction (e.g., `Seraphim_Guild`) without declaring it locally or importing it.
**Fix**: Declare all external actors in the `Declarations` section.
```nvl
ACTOR Seraphim_Guild # Required for relation changes
RELATE Detective_Jack -> Seraphim_Guild affinity=-10 trust=0
```

## Best Practices
-   **State Init**: Always set initial locations for ALL actors at the start of the script.
-   **Micro-Beats**: Break down actions. Instead of just `ACTION ATTACK`, doing `ACTION USE item=Gun` -> `ACTION ATTACK` adds narrative density.

---

## Event Density Mandate (Critical for Prose Length)

**Problem**: If the NVL script is short, the prose will be short. The prose is generated from NVL events, so event count directly dictates narrative length.

**Rule**: Each episode NVL must contain **at minimum 50 actionable events** (excluding ACTOR/GIVE declarations and comments).

**Event Density Guidelines**:
1.  **Micro-Actions for Every Macro-Action**:
    -   **BAD (1 event)**: `ACTION ATTACK subject=Jack target=Thug damage=50`
    -   **GOOD (4 events)**:
        ```nvl
        ACTION USE subject=Jack item=Revolver_Colt_Classic target=Jack # Drawing
        KNOWS Jack Thug_Is_Armored
        ACTION SPEAK subject=Jack fact=Thug_Is_Armored # "Shit, he's got a vest."
        ACTION ATTACK subject=Jack target=Thug damage=50 # Kneecap shot
        ```
2.  **Sensory/Environmental Actions**:
    -   For every scene transition, add 2-3 sensory `KNOWS`/`SPEAK` pairs.
    -   Example: `KNOWS Jack Rain_Smells_Like_Battery_Acid`, `KNOWS Jack Floor_Is_Vibrating`.
3.  **Dialogue Volleys**:
    -   A conversation is not 1 `SPEAK`. It is 5-6 volleys with `RELATE` updates.
    -   Show subtext changes with intermediate `RELATE` or `KNOWS` statements between dialogue turns.
4.  **Object Interaction Chains**:
    -   `ACTION USE item=Door` -> `ACTION USE item=Lockpick` -> `KNOWS Jack Door_Is_Stuck` -> `ACTION USE item=Boot` (Kicking it).

**Target Metrics (Per Episode)**:
| Metric | Minimum |
| :--- | :--- |
| Total Events | 50+ |
| Micro-Actions per Scene | 5-10 |
| Dialogue Volleys per Conversation | 5+ |
| Sensory/Environmental KNOWS | 3+ per Scene |

**Validation**: Before drafting prose, check your NVL event count. If under 50, add more micro-events.
