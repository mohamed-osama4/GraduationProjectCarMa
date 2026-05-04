# مرحلة البناء - هنستخدم SDK 8.0 عشان يتوافق مع الكود الجديد
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# بننسخ ملف المشروع (تأكد إن المسار صح)
COPY ["CarMaintenance.csproj", "./"]
RUN dotnet restore "CarMaintenance.csproj"

# بننسخ باقي الكود وبنعمل Publish
COPY . .
RUN dotnet publish "CarMaintenance.csproj" -c Release -o /app/publish /p:UseAppHost=false

# المرحلة النهائية - الـ Runtime المستقر 8.0
FROM mcr.microsoft.com/dotnet/aspnet:8.0-bookworm-slim AS final
WORKDIR /app
COPY --from=build /app/publish .

# السطر اللي بيحل مشاكل الـ Memory في Render
ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=1

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "CarMaintenance.dll"]