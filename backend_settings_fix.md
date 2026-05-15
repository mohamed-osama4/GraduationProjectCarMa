Hello,

The issue is that the current Admin (and any new user) does not have an initial row in the `UserSettings` table. Because of this, the API for `MySettings` and `Update-Settings` returns a `404 Not Found` error since `settings == null`.

**Solution:**
Instead of returning `NotFound();` in the `SettingsController`, make the code auto-create default settings and save them directly to the database.

**Required changes in `SettingsController.cs`:**

**1. In the `GetSettings` method (for GET):**
Replace this line:
```csharp
if (settings == null)
    return NotFound();
```
With this code:
```csharp
if (settings == null)
{
    settings = new UserSettings { UserId = userId };
    _context.UserSettings.Add(settings);
    await _context.SaveChangesAsync();
}
```

**2. In the `UpdateSettings` method (for PUT):**
Replace this line:
```csharp
if (settings == null)
    return NotFound();
```
With this code:
```csharp
if (settings == null)
{
    settings = new UserSettings { UserId = userId };
    _context.UserSettings.Add(settings);
}
```
