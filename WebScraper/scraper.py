#Do scraper here, if needed

import requests
import time

parliamentGroupsFileUrl = "https://app.parlamento.pt/webutils/docs/doc.xml?path=GFrxmOSdZSVEr0NS7wQNKcKxWCefikuGXCYPeAwZEHxXub2gcoCHn6AkATVs2IQg2c6TJXjqxuZSAVYY%2bjuPprEgsz240mcQdxD8hmc4wWFWNqc%2f3eWy9eZ5D1ZeD5E1qlRLAReNJlb2gTLCa8M9R5JQCUwEKSQgJzvh28K9R8Y8ai442TuXt4WEkfCw2PdHHYkqmyadH2%2fz4ZTmYoAPBBu0tn3L2rxhs0BCcltHZF88XHnodmPSLYXZO8gnmxVuyb%2b7PCTZjug%2ff5G6yaAmV8jfhjYjlXDC%2btm4uhmHze42gsQQh7XrJcoS7896qHli2gejc5SuRH5iR4km07MpjQOKlt66wil%2fYVZG5qd88eg%3d&fich=InformacaoBaseXV.xml&Inline=true"
initiativesFileUrl = "https://app.parlamento.pt/webutils/docs/doc.xml?path=93lt1oSEGEXA%2fFdh133GWy%2b3ZMVSGRG3ZIS6DEnVDNg80g%2be40mJDoXkYPcev2n%2fqzxUW%2bH2HgNC%2bYZKn3LcwfeYTkyCWjduW6zQ8pmZOfPiXhG48lngQdtZ7M7WYm5aXAT0r9JgT8vrhkOS9i7%2fuMDCVXf7mAxSwIA7d12GNyNBeKRuXLd06fJYIzS%2bfpDbGbrIp54PfzX1%2bqcoo76bKpUPpK%2bIT6i7IQ8qEpHWmDwZ%2ftfeOa5eSkZz3nIBajtOAN%2bIYnb8EMneBPaDbGe0jDfHlu7OFcfa4OnW%2fgHR%2b0MSzC4xPwAdxvyLCZsxhoR0m%2fytCVEwGLZ8M90KibE%2bjOw91bgtLNzBGoYpdEl5S9g%3d&fich=IniciativasXV.xml&Inline=true"

def downloadParliamentGroupsFile():
    print("Downloading Parliament groups file")

    start = time.perf_counter()
    response = requests.get(parliamentGroupsFileUrl)
    end = time.perf_counter()

    print(f"Parliament groups took {end - start:0.4f} seconds")
    open("parliamentGroups.xml", "wb").write(response.content)

def downloadInitiativesFile():
    print("Downloading Initiatives file")

    start = time.perf_counter()
    response = requests.get(initiativesFileUrl)
    end = time.perf_counter()

    print(f"Initiatives took {end - start:0.4f} seconds")
    open("initiatives.xml", "wb").write(response.content)