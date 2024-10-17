-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER'
);

-- CreateTable
CREATE TABLE "Cryptocurrency" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "marketValue" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL DEFAULT 'COMPRA',
    "amount" REAL NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "exchangeRate" REAL NOT NULL,
    "originCurrencyId" INTEGER NOT NULL,
    "destinationCurrencyId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Transaction_originCurrencyId_fkey" FOREIGN KEY ("originCurrencyId") REFERENCES "Cryptocurrency" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transaction_destinationCurrencyId_fkey" FOREIGN KEY ("destinationCurrencyId") REFERENCES "Cryptocurrency" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChangeHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" REAL NOT NULL,
    "originCurrencyId" INTEGER NOT NULL,
    "destinationCurrencyId" INTEGER NOT NULL,
    "result" REAL NOT NULL,
    CONSTRAINT "ChangeHistory_originCurrencyId_fkey" FOREIGN KEY ("originCurrencyId") REFERENCES "Cryptocurrency" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ChangeHistory_destinationCurrencyId_fkey" FOREIGN KEY ("destinationCurrencyId") REFERENCES "Cryptocurrency" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Report" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "graphType" TEXT NOT NULL DEFAULT 'LINEA',
    "transactionVolume" INTEGER NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Conversion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "amount" REAL NOT NULL,
    "originCurrencyId" INTEGER NOT NULL,
    "destinationCurrencyId" INTEGER NOT NULL,
    "result" REAL NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Conversion_originCurrencyId_fkey" FOREIGN KEY ("originCurrencyId") REFERENCES "Cryptocurrency" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Conversion_destinationCurrencyId_fkey" FOREIGN KEY ("destinationCurrencyId") REFERENCES "Cryptocurrency" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Conversion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Cryptocurrency_symbol_key" ON "Cryptocurrency"("symbol");
