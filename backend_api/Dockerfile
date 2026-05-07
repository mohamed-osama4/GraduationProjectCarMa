# مرحلة البناء 
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["CarMaintenance.csproj", "./"]
RUN dotnet restore "CarMaintenance.csproj"
COPY . .
RUN dotnet publish "CarMaintenance.csproj" -c Release -o /app/publish /p:UseAppHost=false

# المرحلة النهائية بالنسخة الكاملة بدون تقييد للغات
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "CarMaintenance.dll"]