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
