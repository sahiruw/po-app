
ll = ["TODAYS DATE", "PURPOSE OF NDA", "NDA CREATOR", "NDA CREATOR SIGNATURE IMAGE", "OTHER COMPANY NAME","OTHER COMPANY NAME ABBREVIATION", "OTHER COMPANY ADDRESS", "OTHER COMPANY NUMBER", "OTHER NAME", 'OTHER EMAIL'  ]
varis = []
for i, l in enumerate(ll):
    vari = str(l).lower().replace(" ", "_")
    varis.append(vari)

    print(f'''
' Define the text to find and replace
strFindText = "{{{{{l}}}}}"
{vari} = TextBox{i+1}.Value

' Replace all instances in the document
With wdDoc.Content.Find
    .Text = strFindText
    .Replacement.Text = {vari}
    .Wrap = 1 ' wdFindContinue
    .Execute Replace:=2 ' wdReplaceAll
End With
          
          ''')
    
for i,v in enumerate(varis):
    print(f'{v} = TextBox{i+1}.Value')
