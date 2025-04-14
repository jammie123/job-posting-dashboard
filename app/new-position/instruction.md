Make new folder new-position-v3
- in split button make option "Verze 3"
- Click to "verze 2" redirect to new page
- in this folder create components folder

In components folder there will

- component "JobName" input + label + description + buttons (primary + secondary)
    - label: Název náboru
    - Input placeholder "Např. Zedník do skansky"
    - primary button "Předvyplnit data do formuláře"
    - secondary "Přejít na běžný formulář"


- component "description"
    - rich text editor

- component "locality" label + input + switch (remote)

- component "sallary" same as in "verze 2"

- component "profesion" select with list proffesion 
- component "Field" select with list fields
- Component "Type" radiobutton group ("HPP", "Zkrácený úvazek")
- Component "LanguageLevel" same as @language-selector
- Component "Education" select of education levels
- Component "Benefits" use formulas in @first-step this 
            {/* Benefity */}
            <div className={`rounded-md flex relative group hover:bg-accent/5 transition-colors ${editingFields.benefits ? "p-4 border flex-col w-full" : ""}`}>
              <div className="flex justify-between items-center mr-2">
                <p className="font-medium text-sm w-[200px]">Benefity</p>
                {!editingFields.benefits && !editAllFields && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="absolute right-0 top-0 hidden group-hover:block transition-opacity h-7"
                    onClick={() => toggleFieldEdit('benefits')}
                  >
                    Upravit
                  </Button>
                )}
              </div>

- Component "Advertise-step" same as @advertise-step.tsx

Steps of form 
1. step - Informace o pozici
2. step - Zdat inzerci




Updates of components
- each components has props isViewmode
- when is true then component is for display "key: value" and on hover button "upravit"
- When click on button "upravit" or when isViewmode == false then show component like now


For example component "Locality" 

isViewmode == true
<H3>Místo výkonu práce:</h3>{value} "Československé armády 408/51, 500 03 Hradec Králové"

isViewmode == false then currentstate