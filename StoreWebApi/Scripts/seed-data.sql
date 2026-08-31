INSERT INTO [Products] ([Name], [Category], [Price], [UnitsInStock])
SELECT [Name], [Category], [Price], [UnitsInStock]
FROM (
    VALUES
        (N'ROMEO 3-Seater Sofa', N'Sofa',    2990.00, 8),
        (N'CUPID Armchair',      N'Chair',   1990.00, 12),
        (N'PRESENT Coffee Table',N'Table',   1690.00, 6),
        (N'DREAM Bed',            N'Bed',     2490.00, 5),
        (N'LUNE Side Cabinet',    N'Storage',  649.00, 10)
) AS SeedProducts ([Name], [Category], [Price], [UnitsInStock])
WHERE NOT EXISTS (
    SELECT 1
    FROM [Products]
    WHERE [Products].[Name] = [SeedProducts].[Name]
);