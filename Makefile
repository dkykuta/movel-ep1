FOLDERENTREGA=ep1-diogo-e-fernando
RELATORIODIR=doc

PACOTENAME=$(FOLDERENTREGA).tar.gz

#
##
# Parte padrao
##
#

$(RELATORIODIR):
	if [ ! -d $(RELATORIODIR) ]; then mkdir $(RELATORIODIR); fi

pdf: $(RELATORIODIR)
	cd $(RELATORIODIR); make folderup

entrega: pdf
	rm -f $(PACOTENAME)
	rm -rf $(FOLDERENTREGA)
	mkdir $(FOLDERENTREGA)
# copia os arquivos da entrega para a pasta
	cp -r AgUSP $(FOLDERENTREGA)
	rm -rf $(FOLDERENTREGA)/AgUSP/bin
	cp README $(FOLDERENTREGA)
	cp relatorio.pdf $(FOLDERENTREGA)
	tar -czf $(PACOTENAME) $(FOLDERENTREGA)
	rm -rf $(FOLDERENTREGA)


.PHONY: clean
clean:
	rm -f *~
	cd $(RELATORIODIR); make clean
