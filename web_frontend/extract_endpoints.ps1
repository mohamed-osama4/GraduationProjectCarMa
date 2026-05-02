$json = Get-Content "d:\GradeProject\Carma\postman_collection.json" -Raw | ConvertFrom-Json
function Get-Endpoints($item) {
    if ($null -ne $item.item) {
        foreach ($child in $item.item) { Get-Endpoints $child }
    } elseif ($null -ne $item.request) {
        $url = if ($item.request.url -is [string]) { $item.request.url } else { $item.request.url.raw }
        [PSCustomObject]@{ Name = $item.name; Method = $item.request.method; Url = $url }
    }
}
Get-Endpoints $json.collection | Format-Table -AutoSize
