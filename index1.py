import pandas as pd

# Прочитане на файла като текст
with open('csv/dataset.csv', 'r', encoding='ISO-8859-1') as f:
    lines = f.readlines()

# Обработка на текста
data = []
for line in lines[1:]:
    values = line.split(',')
    row = {
        'make': values[0].strip(),
        'model': values[1].strip(),
        'year': values[2].strip(),
        'engine': values[3].strip(),
        'variant': values[5].strip(),
        'body_styles': values[4].strip(),
        'type': values[6].strip(),
        'kType': values[7].strip()
    }
    data.append(row)

# Преобразуване на данните в DataFrame
df = pd.DataFrame(data)

# Премахване на 'diesel', 'petrol' и 'electric' от 'body_styles'
df['body_styles'] = df['body_styles'].str.replace('Diesel', '').str.replace('Petrol', '')

# Вземане на уникалните 'body_styles'
unique_body_styles = df['body_styles'].unique()

# Извеждане на уникалните 'body_styles'
for body_style in unique_body_styles:
    print(body_style)

# Запазване на модифицираното dataframe в нов CSV файл
df.to_csv('csv/modified_dataset.csv', index=False)
